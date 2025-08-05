import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

export default class ProfileController {
  async show({ inertia, auth, response }: HttpContext) {
    // User is guaranteed to be authenticated due to auth middleware
    const user = auth.user!

    await user.load('projects', (query) => {
      query.preload('tag')
    })

    return inertia.render('profile', {
      projects: user.projects,
      email: user.email,
    })
  }

  async updateEmail({ request, response, auth, session }: HttpContext) {
    if (!auth.user) {
      session?.flash('error', 'Vous devez être connecté pour modifier votre email')
      return response.redirect('/profile')
    }

    const { email } = request.only(['email'])
    const user = auth.user

    // Validate email
    if (!email || !email.includes('@')) {
      session?.flash('error', 'Email invalide')
      return response.redirect('/profile')
    }

    // Update email
    user.email = email
    await user.save()

    session?.flash('success', 'Email mis à jour avec succès')
    return response.redirect('/profile')
  }

  async updatePassword({ request, response, auth, session }: HttpContext) {
    if (!auth.user) {
      session?.flash('error', 'Vous devez être connecté pour modifier votre mot de passe')
      return response.redirect('/profile')
    }

    const { currentPassword, password, passwordConfirmation } = request.only([
      'currentPassword',
      'password',
      'passwordConfirmation',
    ])

    const user = auth.user

    // Validate passwords
    if (!currentPassword || !password || !passwordConfirmation) {
      session?.flash('error', 'Tous les champs sont requis')
      return response.redirect('/profile')
    }

    if (password !== passwordConfirmation) {
      session?.flash('error', 'Les mots de passe ne correspondent pas')
      return response.redirect('/profile')
    }

    if (password.length < 6) {
      session?.flash('error', 'Le mot de passe doit contenir au moins 6 caractères')
      return response.redirect('/profile')
    }

    // Verify current password
    const isPasswordValid = await hash.use('scrypt').verify(user.password, currentPassword)
    if (!isPasswordValid) {
      session?.flash('error', 'Mot de passe actuel incorrect')
      return response.redirect('/profile')
    }

    // Update password
    user.password = await hash.use('scrypt').make(password)
    await user.save()

    session?.flash('success', 'Mot de passe mis à jour avec succès')
    return response.redirect('/profile')
  }

  async deleteAccount({ response, auth, session }: HttpContext) {
    if (!auth.user) {
      session?.flash('error', 'Vous devez être connecté pour supprimer votre compte')
      return response.redirect('/profile')
    }

    const user = auth.user

    // Delete the user
    await user.delete()

    // Logout the user
    await auth.use('web').logout()

    session?.flash('success', 'Votre compte a été supprimé avec succès')
    return response.redirect('/')
  }
}
