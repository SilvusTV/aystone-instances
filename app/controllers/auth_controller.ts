import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

export default class AuthController {
  async showLogin({ inertia }: HttpContext) {
    return inertia.render('auth/login')
  }

  async login({ request, response, auth }: HttpContext) {
    const { uid, password } = request.only(['uid', 'password'])

    try {
      await auth.use('web').attempt(uid, password)
      return response.redirect('/')
    } catch {
      return response.redirect().back().withFlash({ error: 'Identifiants invalides' })
    }
  }

  async showRegister({ inertia }: HttpContext) {
    return inertia.render('auth/register')
  }

  async register({ request, response, auth }: HttpContext) {
    const data = request.only(['username', 'email', 'password', 'password_confirmation'])

    // Validate data
    if (data.password !== data.password_confirmation) {
      return response.redirect().back().withFlash({ error: 'Les mots de passe ne correspondent pas' })
    }

    // Check if username already exists
    const existingUser = await User.findBy('username', data.username)
    if (existingUser) {
      return response.redirect().back().withFlash({ error: 'Ce pseudo est déjà utilisé' })
    }

    // Create user
    const user = await User.create({
      username: data.username,
      email: data.email || null,
      password: await hash.make(data.password),
      role: 'invité',
    })

    // Login user
    await auth.use('web').login(user)
    return response.redirect('/')
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/')
  }
}