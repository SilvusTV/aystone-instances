import User from '#models/user'
import Instance from '#models/instance'
import { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'
import { randomBytes } from 'node:crypto'
import mail from '@adonisjs/mail/services/main'
import PasswordResetMail from '#mails/password_reset_mail'
import env from '#start/env'

export default class AuthController {
  async showLogin({ inertia }: HttpContext) {
    return inertia.render('auth/login')
  }

  async login({ request, response, auth, session }: HttpContext) {
    const { uid, password } = request.only(['uid', 'password'])

    try {
      // Find the user by username or email (case-insensitive)
      const query = User.query()
        .whereRaw('LOWER(username) = ?', [uid.toLowerCase()])
        .orWhereRaw('LOWER(email) = ?', [uid.toLowerCase()])

      const user = await query.first()

      // If no user found, show specific error
      if (!user) {
        session.flash('error', 'Utilisateur non trouvé')
        return response.redirect().withQs().back()
      }

      try {
        // Try to use the auth system's built-in verification
        try {
          await auth.use('web').verifyCredentials({ uid: user.username, password })
        } catch (authError) {
          // Try direct verification with hash.verify
          const isPasswordValid = await hash.use('scrypt').verify(user.password, password)

          if (!isPasswordValid) {
            session.flash('error', 'Mot de passe incorrect')
            return response.redirect().withQs().back()
          }
        }
      } catch (verifyError) {
        console.error('Password verification error:', verifyError)
        session.flash('error', 'Erreur lors de la vérification du mot de passe')
        return response.redirect().withQs().back()
      }

      // Login the user
      await auth.use('web').login(user)
      return response.redirect('/')
    } catch (error) {
      console.error('Login error:', error)
      session.flash('error', 'Erreur lors de la connexion')
      return response.redirect().withQs().back()
    }
  }

  async showRegister({ inertia }: HttpContext) {
    const instances = await Instance.all()
    return inertia.render('auth/register', { instances })
  }

  async register({ request, response, auth, session }: HttpContext) {
    const data = request.only([
      'username',
      'email',
      'password',
      'password_confirmation',
      'instance_id',
    ])

    // Validate data
    if (data.password !== data.password_confirmation) {
      session.flash('error', 'Les mots de passe ne correspondent pas')
      return response.redirect('/register')
    }

    // Check if username already exists
    const existingUser = await User.findBy('username', data.username)
    if (existingUser) {
      session.flash('error', 'Ce pseudo est déjà utilisé')
      return response.redirect('/register')
    }

    try {
      // Hash the password
      const hashedPassword = await hash.use('scrypt').make(data.password)

      // Create user
      const user = await User.create({
        username: data.username,
        email: data.email || null,
        password: hashedPassword,
        role: 'invité',
        instanceId: data.instance_id ? Number.parseInt(data.instance_id as string, 10) : null,
      })

      // Login user
      await auth.use('web').login(user)
      return response.redirect('/')
    } catch (error) {
      console.error('Registration error:', error)
      session.flash('error', "Erreur lors de l'inscription")
      return response.redirect('/register')
    }
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/')
  }

  async showForgotPassword({ inertia }: HttpContext) {
    return inertia.render('auth/forgot-password')
  }

  async forgotPassword({ request, response, session }: HttpContext) {
    const { email } = request.only(['email'])

    // Find the user by email (case-insensitive)
    const user = await User.query()
      .whereRaw('LOWER(email) = ?', [email.toLowerCase()])
      .first()

    // If no user found, show generic success message for security
    if (!user) {
      session.flash('success', 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.')
      return response.redirect().back()
    }

    // Generate a random token
    const resetToken = randomBytes(32).toString('hex')

    // Set token expiration (1 hour from now)
    const resetTokenExpiresAt = DateTime.now().plus({ hours: 1 })

    // Save token to user
    user.resetToken = resetToken
    user.resetTokenExpiresAt = resetTokenExpiresAt
    await user.save()

    // Generate reset URL
    const appUrl = env.get('APP_URL', `http://${env.get('HOST')}:${env.get('PORT')}`)
    const resetUrl = `${appUrl}/reset-password?token=${resetToken}`

    // Send email
    await mail.send(new PasswordResetMail(user.username, resetToken, resetUrl, user.email!))

    session.flash('success', 'Un email de réinitialisation a été envoyé à votre adresse email.')
    return response.redirect().back()
  }

  async showResetPassword({ inertia, request, response, session }: HttpContext) {
    try {
      // Get token from query string
      const { token } = request.qs()
      console.log('Received reset password request with token:', token)

      if (!token) {
        console.log('Token missing in request')
        session.flash('error', 'Token de réinitialisation manquant.')
        return response.redirect('/forgot-password')
      }

      // Find user with this token
      const user = await User.query()
        .where('reset_token', token)
        .first()

      console.log('User found with token:', user ? 'Yes' : 'No')

      // For debugging, let's render the page even if the token is invalid
      // This will help us determine if the issue is with token validation or page rendering
      return inertia.render('auth/reset-password', { token })
    } catch (error) {
      console.error('Error in showResetPassword:', error)
      session.flash('error', 'Une erreur est survenue lors du traitement de votre demande.')
      return response.redirect('/forgot-password')
    }
  }

  async resetPassword({ request, response, session }: HttpContext) {
    const { token, password, passwordConfirmation } = request.only([
      'token',
      'password',
      'password_confirmation',
    ])

    // Validate data
    if (!token) {
      session.flash('error', 'Token de réinitialisation manquant.')
      return response.redirect('/forgot-password')
    }

    if (password !== passwordConfirmation) {
      session.flash('error', 'Les mots de passe ne correspondent pas.')
      return response.redirect().withQs().back()
    }

    if (password.length < 6) {
      session.flash('error', 'Le mot de passe doit contenir au moins 6 caractères.')
      return response.redirect().withQs().back()
    }

    // Find user with this token
    const user = await User.query()
      .where('reset_token', token)
      .first()

    // If no user found or token expired, redirect to forgot password
    if (!user || !user.resetTokenExpiresAt || user.resetTokenExpiresAt < DateTime.now()) {
      session.flash('error', 'Le lien de réinitialisation est invalide ou a expiré.')
      return response.redirect('/forgot-password')
    }

    // Update password
    user.password = await hash.use('scrypt').make(password)
    user.resetToken = null
    user.resetTokenExpiresAt = null
    await user.save()

    session.flash('success', 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.')
    return response.redirect('/login')
  }
}
