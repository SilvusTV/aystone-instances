import User from '#models/user'
import Instance from '#models/instance'
import { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import fs from 'node:fs'
import path from 'node:path'

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

  async updateInstanceImage({ params, request, response, session }: HttpContext) {
    const instance = await Instance.find(params.id)

    if (!instance) {
      session.flash('error', 'Instance non trouvée')
      return response.redirect('/admin/instances')
    }

    // Handle image upload
    const image = request.file('image', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg', 'gif'],
    })

    if (!image) {
      session.flash('error', 'Aucune image fournie')
      return response.redirect('/admin/instances')
    }

    if (!image.isValid) {
      session.flash('error', `Erreur lors de l'upload de l'image: ${image.errors.join(', ')}`)
      return response.redirect('/admin/instances')
    }

    try {
      // Delete the old image if it exists
      if (instance.image) {
        try {
          // Extract the file path from the URL
          // The image URL is like: /resources/uploads/instances/filename.jpg
          // We need to remove the /resources prefix to get the actual file path
          const oldImagePath = instance.image.replace('/resources', '')
          const fullOldImagePath = path.join(process.cwd(), 'resources', oldImagePath)

          // Check if the file exists before attempting to delete it
          if (fs.existsSync(fullOldImagePath)) {
            fs.unlinkSync(fullOldImagePath)
            console.log(`Deleted old image: ${fullOldImagePath}`)
          }
        } catch (deleteError) {
          console.error('Error deleting old image:', deleteError)
          // Continue with the upload even if deleting the old image fails
        }
      }

      // Generate a unique name for the image
      const imageName = `${new Date().getTime()}_${image.clientName}`

      // Create the uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'resources', 'uploads', 'instances')

      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
      }

      // Move the uploaded file to the resources/uploads/instances directory
      await image.move(uploadsDir, {
        name: imageName,
        overwrite: true,
      })

      // Update the instance with the image path
      instance.image = `/resources/uploads/instances/${imageName}`
      await instance.save()

      session.flash('success', `Image de l'instance "${instance.name}" mise à jour avec succès`)
    } catch (error) {
      console.error('Error updating instance image:', error)
      session.flash('error', "Erreur lors de la mise à jour de l'image de l'instance")
    }

    return response.redirect('/admin/instances')
  }
}
