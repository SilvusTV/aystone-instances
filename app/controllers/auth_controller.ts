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
      const query = User.query()
        .whereRaw('LOWER(username) = ?', [uid.toLowerCase()])
        .orWhereRaw('LOWER(email) = ?', [uid.toLowerCase()])

      const user = await query.first()

      if (!user) {
        session.flash('error', 'Utilisateur non trouvé')
        return response.redirect().withQs().back()
      }

      try {
        console.log('Mot de passe reçu:', `"${password}"`)
        console.log('Mot de passe en base:', user.password)

        const isPasswordValid = await hash.verify(user.password, password)
        console.log('Mot de passe valide ?', isPasswordValid)

        if (!isPasswordValid) {
          session.flash('error', 'Mot de passe incorrect')
          return response.redirect().withQs().back()
        }
      } catch (verifyError) {
        console.error('Erreur vérification mot de passe:', verifyError)
        session.flash('error', 'Erreur lors de la vérification du mot de passe')
        return response.redirect().withQs().back()
      }

      await auth.use('web').login(user)
      return response.redirect('/')
    } catch (error) {
      console.error('Erreur connexion:', error)
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

    if (data.password !== data.password_confirmation) {
      session.flash('error', 'Les mots de passe ne correspondent pas')
      return response.redirect('/register')
    }

    const existingUser = await User.findBy('username', data.username)
    if (existingUser) {
      session.flash('error', 'Ce pseudo est déjà utilisé')
      return response.redirect('/register')
    }

    try {
      const user = await User.create({
        username: data.username,
        email: data.email || null,
        password: data.password, // 🟢 Mot de passe brut (le hash sera fait automatiquement)
        role: 'invité',
        instanceId: data.instance_id ? Number.parseInt(data.instance_id as string, 10) : null,
      })

      await auth.use('web').login(user)
      return response.redirect('/')
    } catch (error) {
      console.error('Erreur inscription:', error)
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

    const user = await User.query()
      .whereRaw('LOWER(email) = ?', [email.toLowerCase()])
      .first()

    if (!user) {
      session.flash('success', 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.')
      return response.redirect().back()
    }

    const resetToken = randomBytes(32).toString('hex')
    const resetTokenExpiresAt = DateTime.now().plus({ hours: 1 })

    user.resetToken = resetToken
    user.resetTokenExpiresAt = resetTokenExpiresAt
    await user.save()

    const appUrl = env.get('APP_URL', `http://${env.get('HOST')}:${env.get('PORT')}`)
    const resetUrl = `${appUrl}/reset-password?token=${resetToken}`

    await mail.send(new PasswordResetMail(user.username, resetToken, resetUrl, user.email!))

    session.flash('success', 'Un email de réinitialisation a été envoyé à votre adresse email.')
    return response.redirect().back()
  }

  async showResetPassword({ inertia, request, response, session }: HttpContext) {
    try {
      const { token } = request.qs()
      console.log('Token reçu pour reset password :', token)

      if (!token) {
        session.flash('error', 'Token de réinitialisation manquant.')
        return response.redirect('/forgot-password')
      }

      const user = await User.query()
        .where('reset_token', token)
        .first()

      console.log('Utilisateur avec token ?', user ? 'Oui' : 'Non')

      return inertia.render('auth/reset-password', { token })
    } catch (error) {
      console.error('Erreur dans showResetPassword:', error)
      session.flash('error', 'Une erreur est survenue lors du traitement de votre demande.')
      return response.redirect('/forgot-password')
    }
  }

  async resetPassword({ request, response, session }: HttpContext) {
    const { token, password, password_confirmation: passwordConfirmation } = request.only([
      'token',
      'password',
      'password_confirmation',
    ])

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

    const user = await User.query()
      .where('reset_token', token)
      .first()

    if (!user || !user.resetTokenExpiresAt || user.resetTokenExpiresAt < DateTime.now()) {
      session.flash('error', 'Le lien de réinitialisation est invalide ou a expiré.')
      return response.redirect('/forgot-password')
    }

    user.password = password // Let the AuthFinder mixin handle the hashing
    user.resetToken = null
    user.resetTokenExpiresAt = null
    await user.save()

    session.flash('success', 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.')
    return response.redirect('/login')
  }
}
