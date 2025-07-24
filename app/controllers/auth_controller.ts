import User from '#models/user'
import Instance from '#models/instance'
import { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

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
}
