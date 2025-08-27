import { HttpContext } from '@adonisjs/core/http'
import Instance from '#models/instance'
import Project from '#models/project'
import User from '#models/user'
import InstanceDescription from '#models/instance_description'
import UserVisitedProject from '#models/user_visited_project'
import InstanceService from '#models/instance_service'
import s3Service from '#services/s3_service'
import UserService from '#models/user_service'

export default class InstancesController {
  async index({ inertia }: HttpContext) {
    const instances = await Instance.all()
    return inertia.render('instances/index', { instances })
  }

  async show({ inertia, params, auth }: HttpContext) {
    const instance = await Instance.findByOrFail('name', params.name)
    await instance.load('descriptions')
    
    // Check if user is an instance admin for this instance or a global admin
    const canEdit = auth.user && (
      auth.user.role === 'admin' ||
      (auth.user.role === 'instanceAdmin' && auth.user.instanceId === instance.id)
    )
    
    // Get project statistics for this instance
    const projects = await Project.query().where('instance_id', instance.id).exec()
    
    // Calculate statistics
    const projectStats = {
      total: projects.length,
      byStatus: {
        en_cours: projects.filter(p => p.status === 'en_cours').length,
        termine: projects.filter(p => p.status === 'termine').length
      },
      byDimension: {
        overworld: projects.filter(p => p.dimension === 'overworld').length,
        nether: projects.filter(p => p.dimension === 'nether').length,
        end: projects.filter(p => p.dimension === 'end').length
      },
      byTag: {}
    }
    
    // Count projects by tag
    const tagCounts = {}
    for (const project of projects) {
      if (project.tag) {
        const tagLabel = project.tag.label
        tagCounts[tagLabel] = (tagCounts[tagLabel] || 0) + 1
      }
    }
    projectStats.byTag = tagCounts
    
    return inertia.render('instances/show', { instance, projectStats, canEdit })
  }

  async projects({ inertia, params, auth, request }: HttpContext) {
    const instance = await Instance.findByOrFail('name', params.name)
    const visitedFilter = request.input('visited', 'all')
    const privacyFilter = request.input('privacy', 'all')

    let query = Project.query()
      .where('instance_id', instance.id)
      .preload('user')
      .preload('tag')
      .orderBy('created_at', 'desc')

    // Apply privacy filter if specified
    if (privacyFilter !== 'all') {
      const isPrivate = privacyFilter === 'private'
      query = query.where('is_private', isPrivate)
    }

    let projects = await query.exec()

    // Add visited status to projects if user is authenticated and has visiteurPlus role
    if (auth.user && auth.user.role === 'visiteurPlus') {
      // Use the static method to set the isVisited property
      await Project.setVisitedStatus(projects, auth.user.id)

      // Apply visited filter if specified
      if (visitedFilter !== 'all') {
        const isVisited = visitedFilter === 'visited'
        projects = projects.filter((project) => project.isVisited === isVisited)
      }
    }

    return inertia.render('instances/projects', {
      instance,
      projects,
      filters: { visited: visitedFilter, privacy: privacyFilter },
    })
  }

  async description({ inertia, params, auth }: HttpContext) {
    const instance = await Instance.findByOrFail('name', params.name)
    await instance.load('descriptions')

    // Auth is automatically passed to the view by the inertia middleware
    return inertia.render('instances/description', { instance })
  }

  async editDescription({ inertia, params, auth }: HttpContext) {
    const instance = await Instance.findByOrFail('name', params.name)
    await instance.load('descriptions')

    // Check if user is an instance admin for this instance or a global admin
    const canEdit =
      auth.user!.role === 'admin' ||
      (auth.user!.role === 'instanceAdmin' && auth.user!.instanceId === instance.id)

    return inertia.render('instances/edit_description', { instance, canEdit })
  }

  async updateDescription({ params, request, response, session }: HttpContext) {
    const instance = await Instance.findByOrFail('name', params.name)
    const { title, content } = request.only(['title', 'content'])

    try {
      // Create a new description entry
      await InstanceDescription.create({
        instanceId: instance.id,
        title,
        content,
      })

      session?.flash('success', 'Description mise à jour avec succès')
      return response.redirect(`/instances/${instance.name}`)
    } catch (error) {
      console.error('Error updating instance description:', error)
      session?.flash('error', 'Erreur lors de la mise à jour de la description')
      return response.redirect().back()
    }
  }

  async deleteDescription({ params, response, session }: HttpContext) {
    const instance = await Instance.findByOrFail('name', params.name)
    const descriptionId = params.id
    
    try {
      // Find the description
      const description = await InstanceDescription.findOrFail(descriptionId)
      
      // Check if the description belongs to the instance
      if (description.instanceId !== instance.id) {
        session?.flash('error', 'Cette description n\'appartient pas à cette instance')
        return response.redirect().back()
      }
      
      // Delete the description
      await description.delete()
      
      session?.flash('success', 'Description supprimée avec succès')
      return response.redirect(`/instances/${instance.name}/description/edit`)
    } catch (error) {
      console.error('Error deleting instance description:', error)
      session?.flash('error', 'Erreur lors de la suppression de la description')
      return response.redirect().back()
    }
  }
  
  async editExistingDescription({ params, request, response, session }: HttpContext) {
    const instance = await Instance.findByOrFail('name', params.name)
    const descriptionId = params.id
    const { title, content } = request.only(['title', 'content'])
    
    try {
      // Find the description
      const description = await InstanceDescription.findOrFail(descriptionId)
      
      // Check if the description belongs to the instance
      if (description.instanceId !== instance.id) {
        session?.flash('error', 'Cette description n\'appartient pas à cette instance')
        return response.redirect().back()
      }
      
      // Update the description
      description.title = title
      description.content = content
      await description.save()
      
      session?.flash('success', 'Description modifiée avec succès')
      return response.redirect(`/instances/${instance.name}/description/edit`)
    } catch (error) {
      console.error('Error editing instance description:', error)
      session?.flash('error', 'Erreur lors de la modification de la description')
      return response.redirect().back()
    }
  }

  async members({ inertia, params }: HttpContext) {
    const instance = await Instance.findByOrFail('name', params.name)

    // Get all users who belong to this instance
    const members = await User.query().where('instance_id', instance.id).exec()

    return inertia.render('instances/members', { instance, members })
  }

  async dynmap({ inertia, params }: HttpContext) {
    const instance = await Instance.findByOrFail('name', params.name)
    return inertia.render('instances/dynmap', { instance })
  }

  // Service view (only player services shown)
  async service({ inertia, params, auth }: HttpContext) {
    const instance = await Instance.findByOrFail('name', params.name)

    // Load user services belonging to users of this instance
    const userServices = await UserService.query()
      .whereHas('user', (qb) => qb.where('instance_id', instance.id))
      .preload('user')
      .orderBy('created_at', 'desc')
      .exec()

    const canManageUserServices = !!auth.user && ['joueur', 'instanceAdmin', 'admin'].includes(auth.user.role) && (auth.user.role === 'admin' || auth.user.instanceId === instance.id)

    return inertia.render('instances/service', { instance, userServices, canManageUserServices })
  }

  // Service edit page
  async editService({ inertia, params, auth }: HttpContext) {
    const instance = await Instance.findByOrFail('name', params.name)
    await instance.load('service')

    const canEdit =
      !!auth.user && (auth.user.role === 'admin' || (auth.user.role === 'instanceAdmin' && auth.user.instanceId === instance.id))

    return inertia.render('instances/edit_service', { instance, canEdit })
  }

  // Create or update the service
  async updateService({ params, request, response, session }: HttpContext) {
    const instance = await Instance.findByOrFail('name', params.name)
    const { title, price, priceCents, description } = request.only(['title', 'price', 'priceCents', 'description'])

    try {
      // Normalize and parse price coming either as cents or as string with possible comma decimal separator
      const parseNumber = (v: unknown): number => {
        if (typeof v === 'number') return v
        if (v === null || v === undefined) return NaN
        const s = String(v).replace(/\s+/g, '').replace(',', '.').trim()
        const n = Number(s)
        return isNaN(n) ? NaN : n
      }

      const centsFromPayload = parseNumber(priceCents)
      const eurosFromPayload = parseNumber(price)

      let computedPriceCents = 0
      if (!isNaN(centsFromPayload)) {
        computedPriceCents = Math.max(0, Math.round(centsFromPayload))
      } else if (!isNaN(eurosFromPayload)) {
        computedPriceCents = Math.max(0, Math.round(eurosFromPayload * 100))
      } else {
        computedPriceCents = 0
      }

      // Upsert
      let service = await InstanceService.query().where('instance_id', instance.id).first()
      if (!service) {
        service = new InstanceService()
        service.instanceId = instance.id
      }
      service.title = title
      service.priceCents = computedPriceCents
      service.description = description
      await service.save()

      session?.flash('success', 'Service enregistré avec succès')
      return response.redirect(`/instances/${instance.name}/service`)
    } catch (error) {
      console.error('Error updating instance service:', error)
      session?.flash('error', 'Erreur lors de la sauvegarde du service')
      return response.redirect().back()
    }
  }

  // Upload image for service description and convert to WebP
  async uploadServiceImage({ params, request, response }: HttpContext) {
    try {
      const instance = await Instance.findByOrFail('name', params.name)
      const file = request.file('image') || request.file('file')
      if (!file || !file.tmpPath) {
        return response.status(400).json({ error: 'Aucune image fournie' })
      }

      // Dynamically import sharp to avoid issues if not installed at build time
      const sharp = (await import('sharp')).default

      // Convert to webp
      const inputBuffer = await import('node:fs/promises').then((fs) => fs.readFile(file.tmpPath!))
      const webpBuffer = await sharp(inputBuffer).webp({ quality: 80 }).toBuffer()

      const unique = `${Date.now()}_${Math.random().toString(36).slice(2)}`
      const filename = `${unique}.webp`
      const key = `user/services/${filename}`

      await s3Service.uploadBuffer(webpBuffer, key, 'image/webp')

      // Return a stable URL via our S3 proxy route
      const url = `/s3/user/services/${filename}`
      return response.json({ url })
    } catch (error) {
      console.error('Error uploading service image:', error)
      return response.status(500).json({ error: 'Échec du téléversement de l\'image' })
    }
  }

  // Upload image for user service description (player-accessible) and convert to WebP
  async uploadUserServiceImage({ params, request, response, auth }: HttpContext) {
    try {
      const instance = await Instance.findByOrFail('name', params.name)
      const user = auth.user!
      if (!user || (user.role !== 'admin' && user.instanceId !== instance.id)) {
        return response.status(403).json({ error: "Non autorisé" })
      }

      const file = request.file('image') || request.file('file')
      if (!file || !file.tmpPath) {
        return response.status(400).json({ error: 'Aucune image fournie' })
      }

      const sharp = (await import('sharp')).default
      const inputBuffer = await import('node:fs/promises').then((fs) => fs.readFile(file.tmpPath!))
      const webpBuffer = await sharp(inputBuffer).webp({ quality: 80 }).toBuffer()

      const unique = `${Date.now()}_${Math.random().toString(36).slice(2)}`
      const filename = `${unique}.webp`
      const key = `user/player_services/${filename}`

      await s3Service.uploadBuffer(webpBuffer, key, 'image/webp')

      const url = `/s3/user/player_services/${filename}`
      return response.json({ url })
    } catch (error) {
      console.error('Error uploading user service image:', error)
      return response.status(500).json({ error: "Échec du téléversement de l'image" })
    }
  }

  // ===== User services (CRUD within instance page) =====
  async createUserService({ params, request, response, auth, session }: HttpContext) {
    const instance = await Instance.findByOrFail('name', params.name)
    const user = auth.user!

    // must be logged in, be admin or belong to this instance
    if (!user || (user.role !== 'admin' && user.instanceId !== instance.id)) {
      session?.flash('error', "Vous n'avez pas l'autorisation de créer un service ici")
      return response.redirect().back()
    }

    const { title, price, priceCents, description } = request.only(['title', 'price', 'priceCents', 'description'])

    const parseNumber = (v: unknown): number => {
      if (typeof v === 'number') return v
      if (v === null || v === undefined) return NaN
      const s = String(v).replace(/\s+/g, '').replace(',', '.').trim()
      const n = Number(s)
      return isNaN(n) ? NaN : n
    }

    const centsFromPayload = parseNumber(priceCents)
    const eurosFromPayload = parseNumber(price)

    let computedPriceCents = 0
    if (!isNaN(centsFromPayload)) {
      computedPriceCents = Math.max(0, Math.round(centsFromPayload))
    } else if (!isNaN(eurosFromPayload)) {
      computedPriceCents = Math.max(0, Math.round(eurosFromPayload * 100))
    }

    await UserService.create({
      userId: user.id,
      title,
      priceCents: computedPriceCents,
      description: description ?? null,
    })

    session?.flash('success', 'Service créé avec succès')
    return response.redirect(`/instances/${instance.name}/service`)
  }

  async updateUserService({ params, request, response, auth, session }: HttpContext) {
    const instance = await Instance.findByOrFail('name', params.name)
    const user = auth.user!
    const service = await UserService.query().where('id', params.id).preload('user').first()
    if (!service) {
      session?.flash('error', 'Service introuvable')
      return response.redirect(`/instances/${instance.name}/service`)
    }
    const belongsToInstance = service.user && service.user.instanceId === instance.id
    const isOwner = user && service.userId === user.id
    const isAdmin = user && user.role === 'admin'
    if (!user || (!isAdmin && !(isOwner && belongsToInstance))) {
      session?.flash('error', "Vous n'avez pas l'autorisation de modifier ce service")
      return response.redirect(`/instances/${instance.name}/service`)
    }

    const { title, price, priceCents, description } = request.only(['title', 'price', 'priceCents', 'description'])

    const parseNumber = (v: unknown): number => {
      if (typeof v === 'number') return v
      if (v === null || v === undefined) return NaN
      const s = String(v).replace(/\s+/g, '').replace(',', '.').trim()
      const n = Number(s)
      return isNaN(n) ? NaN : n
    }

    const centsFromPayload = parseNumber(priceCents)
    const eurosFromPayload = parseNumber(price)

    let computedPriceCents = 0
    if (!isNaN(centsFromPayload)) {
      computedPriceCents = Math.max(0, Math.round(centsFromPayload))
    } else if (!isNaN(eurosFromPayload)) {
      computedPriceCents = Math.max(0, Math.round(eurosFromPayload * 100))
    }

    service.title = title
    service.priceCents = computedPriceCents
    service.description = description ?? null
    await service.save()

    session?.flash('success', 'Service modifié avec succès')
    return response.redirect(`/instances/${instance.name}/service`)
  }

  async deleteUserService({ params, response, auth, session }: HttpContext) {
    const instance = await Instance.findByOrFail('name', params.name)
    const user = auth.user!
    const service = await UserService.query().where('id', params.id).preload('user').first()
    if (!service) {
      session?.flash('error', 'Service introuvable')
      return response.redirect(`/instances/${instance.name}/service`)
    }
    const belongsToInstance = service.user && service.user.instanceId === instance.id
    const isOwner = user && service.userId === user.id
    const isAdmin = user && user.role === 'admin'
    if (!user || (!isAdmin && !(isOwner && belongsToInstance))) {
      session?.flash('error', "Vous n'avez pas l'autorisation de supprimer ce service")
      return response.redirect(`/instances/${instance.name}/service`)
    }

    await service.delete()
    session?.flash('success', 'Service supprimé avec succès')
    return response.redirect(`/instances/${instance.name}/service`)
  }
}
