import User from '#models/user'
import Instance from '#models/instance'
import { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

export default class AdminController {
  async users({ inertia }: HttpContext) {
    const users = await User.query().preload('instance').exec()
    const instances = await Instance.all()
    return inertia.render('admin/users', { users, instances })
  }

  async updateUserRole({ params, request, response }: HttpContext) {
    const user = await User.find(params.id)

    if (!user) {
      return response.redirect('/admin/users')
    }

    const { role } = request.only(['role'])

    if (!['invité', 'joueur', 'instanceAdmin', 'admin'].includes(role)) {
      return response.redirect('/admin/users')
    }

    user.role = role
    await user.save()

    return response.redirect('/admin/users')
  }

  async deleteUser({ params, response }: HttpContext) {
    const user = await User.find(params.id)

    if (!user) {
      return response.redirect('/admin/users')
    }

    await user.delete()

    return response.redirect('/admin/users')
  }

  async resetPassword({ params, request, response, session }: HttpContext) {
    const user = await User.find(params.id)

    if (!user) {
      session.flash('error', 'Utilisateur non trouvé')
      return response.redirect('/admin/users')
    }

    const { password } = request.only(['password'])

    if (!password || password.length < 6) {
      session.flash('error', 'Le mot de passe doit contenir au moins 6 caractères')
      return response.redirect('/admin/users')
    }

    // Hash the password using the scrypt driver
    user.password = await hash.use('scrypt').make(password)
    await user.save()

    session.flash('success', `Mot de passe réinitialisé pour ${user.username}`)
    return response.redirect('/admin/users')
  }

  async updateUserInstance({ params, request, response, session }: HttpContext) {
    const user = await User.find(params.id)

    if (!user) {
      session.flash('error', 'Utilisateur non trouvé')
      return response.redirect('/admin/users')
    }

    const { instanceId } = request.only(['instanceId'])

    // Handle different types of instanceId values
    let parsedInstanceId = null

    if (instanceId) {
      if (typeof instanceId === 'number') {
        parsedInstanceId = instanceId
      } else if (typeof instanceId === 'string' && instanceId.trim() !== '') {
        parsedInstanceId = Number.parseInt(instanceId, 10)

        // If parseInt failed, try using Number
        if (Number.isNaN(parsedInstanceId)) {
          const numberValue = Number(instanceId)
          if (!Number.isNaN(numberValue)) {
            parsedInstanceId = numberValue
          }
        }
      }
    }

    // Update the user's instanceId
    user.instanceId = parsedInstanceId
    await user.save()

    session.flash('success', `Instance de ${user.username} mise à jour avec succès`)
    return response.redirect('/admin/users')
  }

  async instances({ inertia }: HttpContext) {
    const instances = await Instance.all()
    return inertia.render('admin/instances', { instances })
  }

  async createInstance({ request, response, session }: HttpContext) {
    const { name } = request.only(['name'])

    if (!name || name.trim() === '') {
      session.flash('error', "Le nom de l'instance est requis")
      return response.redirect('/admin/instances')
    }

    // Check if instance with this name already exists
    const existingInstance = await Instance.findBy('name', name)
    if (existingInstance) {
      session.flash('error', 'Une instance avec ce nom existe déjà')
      return response.redirect('/admin/instances')
    }

    try {
      // Create the instance
      await Instance.create({ name })
      session.flash('success', `Instance "${name}" créée avec succès`)
    } catch (error) {
      console.error('Error creating instance:', error)
      session.flash('error', "Erreur lors de la création de l'instance")
    }

    return response.redirect('/admin/instances')
  }
}
