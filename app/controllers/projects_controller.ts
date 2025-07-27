import Project from '#models/project'
import Tag from '#models/tag'
import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class ProjectsController {
  async show({ inertia, params, response, auth }: HttpContext) {
    const project = await Project.find(params.id)

    if (!project) {
      return response.redirect('/dashboard')
    }

    await project.load('user')
    await project.load('tag')
    await project.load('collaborators')

    // If the user is the owner of the project or an admin, get users from the same instance for collaborator selection
    let users = []
    if (auth.user && (auth.user.id === project.userId || auth.user.role === 'admin')) {
      users = await User.query()
        .where('instance_id', project.instanceId)
        .orderBy('username', 'asc')
        .exec()
    }

    return inertia.render('projects/show', { project, users })
  }
  async index({ inertia, request }: HttpContext) {
    const status = request.input('status', 'all')
    const dimension = request.input('dimension', 'all')
    const tagId = request.input('tag_id', 'all')

    let query = Project.query().preload('user').preload('tag')

    if (status !== 'all') {
      query = query.where('status', status)
    }

    if (dimension !== 'all') {
      query = query.where('dimension', dimension)
    }

    if (tagId !== 'all') {
      query = query.where('tag_id', tagId)
    }

    const projects = await query.exec()
    const tags = await Tag.all()

    return inertia.render('projects/index', {
      projects,
      tags,
      filters: { status, dimension, tagId },
    })
  }

  async create({ inertia, auth }: HttpContext) {
    const tags = await Tag.all()
    // Only load users from the same instance as the authenticated user
    const users = await User.query()
      .where('instance_id', auth.user!.instanceId)
      .orderBy('username', 'asc')
      .exec()
    return inertia.render('projects/create', { tags, users })
  }

  async store({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const data = request.only([
      'name',
      'description',
      'dimension',
      'x',
      'y',
      'z',
      'complementary_x',
      'complementary_y',
      'complementary_z',
      'tag_id',
      'dynmap_url',
      'collaborators',
    ])

    // Create the project
    const project = await Project.create({
      userId: user.id,
      instanceId: user.instanceId,
      name: data.name,
      description: data.description,
      dimension: data.dimension,
      x: data.x,
      y: data.y,
      z: data.z,
      complementary_x: data.complementary_x || null,
      complementary_y: data.complementary_y || null,
      complementary_z: data.complementary_z || null,
      tagId: data.tag_id,
      dynmapUrl: data.dynmap_url || null,
      status: 'en_cours',
    })

    // Add collaborators if any were selected
    if (data.collaborators && Array.isArray(data.collaborators) && data.collaborators.length > 0) {
      const collaboratorsData = data.collaborators.reduce((acc, userId) => {
        acc[userId] = { created_at: new Date() }
        return acc
      }, {})

      await project.related('collaborators').attach(collaboratorsData)
    }

    return response.redirect('/dashboard')
  }

  async edit({ inertia, params, auth, response }: HttpContext) {
    const project = await Project.find(params.id)

    if (!project) {
      return response.redirect('/dashboard')
    }

    // Check if user is the owner of the project
    if (project.userId !== auth.user!.id && auth.user!.role !== 'admin') {
      return response.redirect('/dashboard')
    }

    const tags = await Tag.all()

    return inertia.render('projects/edit', { project, tags })
  }

  async update({ params, request, response, auth }: HttpContext) {
    const project = await Project.find(params.id)

    if (!project) {
      return response.redirect('/dashboard')
    }

    // Check if user is the owner of the project
    if (project.userId !== auth.user!.id && auth.user!.role !== 'admin') {
      return response.redirect('/dashboard')
    }

    const data = request.only([
      'name',
      'description',
      'dimension',
      'x',
      'y',
      'z',
      'complementary_x',
      'complementary_y',
      'complementary_z',
      'tag_id',
      'dynmap_url',
      'status',
    ])

    project.name = data.name
    project.description = data.description
    project.dimension = data.dimension
    project.x = data.x
    project.y = data.y
    project.z = data.z
    project.complementary_x = data.complementary_x || null
    project.complementary_y = data.complementary_y || null
    project.complementary_z = data.complementary_z || null
    project.tagId = data.tag_id
    project.dynmapUrl = data.dynmap_url || null
    project.status = data.status

    await project.save()

    return response.redirect('/dashboard')
  }

  async destroy({ params, response, auth }: HttpContext) {
    const project = await Project.find(params.id)

    if (!project) {
      return response.redirect('/dashboard')
    }

    // Check if user is the owner of the project
    if (project.userId !== auth.user!.id && auth.user!.role !== 'admin') {
      return response.redirect('/dashboard')
    }

    await project.delete()

    return response.redirect('/dashboard')
  }

  async dashboard({ inertia, auth }: HttpContext) {
    const user = auth.user!

    await user.load('projects', (query) => {
      query.preload('tag')
    })

    return inertia.render('dashboard', { projects: user.projects })
  }

  async addCollaborator({ params, request, response, auth }: HttpContext) {
    const project = await Project.find(params.id)

    if (!project) {
      return response.redirect('/dashboard')
    }

    // Check if user is the owner of the project or an admin
    if (project.userId !== auth.user!.id && auth.user!.role !== 'admin') {
      return response.redirect('/dashboard')
    }

    const userId = request.input('user_id')

    // Load existing collaborators to check if user is already a collaborator
    await project.load('collaborators')

    // Check if user is already a collaborator
    const isAlreadyCollaborator = project.collaborators.some(
      (collaborator) => collaborator.id === Number.parseInt(userId)
    )

    if (!isAlreadyCollaborator) {
      await project.related('collaborators').attach({
        [userId]: {
          created_at: new Date(),
        },
      })
    }

    return response.redirect().back()
  }

  async removeCollaborator({ params, request, response, auth }: HttpContext) {
    const project = await Project.find(params.id)

    if (!project) {
      return response.redirect('/dashboard')
    }

    // Check if user is the owner of the project or an admin
    if (project.userId !== auth.user!.id && auth.user!.role !== 'admin') {
      return response.redirect('/dashboard')
    }

    const userId = request.input('user_id')

    await project.related('collaborators').detach([userId])

    return response.redirect().back()
  }
}
