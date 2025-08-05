import User from '#models/user'
import Instance from '#models/instance'
import { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import s3Service from '#services/s3_service'

export default class AdminController {
  async users({ inertia }: HttpContext) {
    const users = await User.query().preload('instance').orderBy('created_at', 'desc').exec()
    const instances = await Instance.all()
    return inertia.render('admin/users', { users, instances })
  }

  async updateUserRole({ params, request, response }: HttpContext) {
    const user = await User.find(params.id)

    if (!user) {
      return response.redirect('/admin/users')
    }

    const { role } = request.only(['role'])

    if (!['invité', 'joueur', 'instanceAdmin', 'admin', 'visiteurPlus'].includes(role)) {
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
      session?.flash('error', 'Utilisateur non trouvé')
      return response.redirect('/admin/users')
    }

    const { password } = request.only(['password'])

    if (!password || password.length < 6) {
      session?.flash('error', 'Le mot de passe doit contenir au moins 6 caractères')
      return response.redirect('/admin/users')
    }

    // Hash the password using the scrypt driver
    user.password = await hash.use('scrypt').make(password)
    await user.save()

    session?.flash('success', `Mot de passe réinitialisé pour ${user.username}`)
    return response.redirect('/admin/users')
  }

  async updateUserInstance({ params, request, response, session }: HttpContext) {
    const user = await User.find(params.id)

    if (!user) {
      session?.flash('error', 'Utilisateur non trouvé')
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

    session?.flash('success', `Instance de ${user.username} mise à jour avec succès`)
    return response.redirect('/admin/users')
  }

  async instances({ inertia }: HttpContext) {
    const instances = await Instance.all()
    return inertia.render('admin/instances', { instances })
  }

  async createInstance({ request, response, session }: HttpContext) {
    const { name } = request.only(['name'])

    if (!name || name.trim() === '') {
      session?.flash('error', "Le nom de l'instance est requis")
      return response.redirect('/admin/instances')
    }

    // Check if instance with this name already exists
    const existingInstance = await Instance.findBy('name', name)
    if (existingInstance) {
      session?.flash('error', 'Une instance avec ce nom existe déjà')
      return response.redirect('/admin/instances')
    }

    try {
      // Create the instance
      await Instance.create({ name })
      session?.flash('success', `Instance "${name}" créée avec succès`)
    } catch (error) {
      console.error('Error creating instance:', error)
      session?.flash('error', "Erreur lors de la création de l'instance")
    }

    return response.redirect('/admin/instances')
  }

  async updateInstanceImage({ params, request, response, session }: HttpContext) {
    const instance = await Instance.find(params.id)

    if (!instance) {
      session?.flash('error', 'Instance non trouvée')
      return response.redirect('/admin/instances')
    }

    // Handle image upload
    const image = request.file('image', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg', 'gif'],
    })

    if (!image) {
      session?.flash('error', 'Aucune image fournie')
      return response.redirect('/admin/instances')
    }

    if (!image.isValid) {
      session?.flash('error', `Erreur lors de l'upload de l'image: ${image.errors.join(', ')}`)
      return response.redirect('/admin/instances')
    }

    try {
      // Delete the old image from S3 if it exists
      if (instance.image) {
        try {
          // Check if it's a direct S3 URL or our S3 controller URL
          if (instance.image.includes('://')) {
            // Direct S3 URL
            await s3Service.deleteFile(instance.image)
          } else if (instance.image.startsWith('/s3/')) {
            // Our S3 controller URL format: /s3/directory/filename
            const parts = instance.image.split('/')
            // parts[0] is empty, parts[1] is 's3', parts[2] is directory, parts[3] is filename
            const directory = parts[2]
            const filename = parts[3]
            const key = `${directory}/${filename}`

            // Delete the file using the key
            await s3Service.deleteFileByKey(key)
          }
        } catch (deleteError) {
          console.error('Error deleting old image from S3:', deleteError)
          // Continue with the upload even if deleting the old image fails
        }
      }

      // Upload the new image to S3
      const s3Url = await s3Service.uploadFile(image, 'instances')

      // Extract the key from the S3 URL
      const urlParts = new URL(s3Url)
      const pathParts = urlParts.pathname.split('/')

      // Remove the first empty element and the bucket name
      pathParts.shift() // Remove empty element
      pathParts.shift() // Remove bucket name

      // Get the directory and filename
      const key = pathParts.join('/')
      const parts = key.split('/')
      const directory = parts[0]
      const filename = parts[1]

      // Create a URL that uses our S3 controller route
      const imageUrl = `/s3/${directory}/${filename}`

      // Update the instance with the URL that uses our S3 controller
      instance.image = imageUrl
      await instance.save()

      session?.flash('success', `Image de l'instance "${instance.name}" mise à jour avec succès`)
    } catch (error) {
      console.error('Error updating instance image:', error)
      session?.flash('error', "Erreur lors de la mise à jour de l'image de l'instance")
    }

    return response.redirect('/admin/instances')
  }
}
