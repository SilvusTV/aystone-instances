import Project from '#models/project'
import Tag from '#models/tag'
import User from '#models/user'
import UserVisitedProject from '#models/user_visited_project'
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
    let users: User[] = []
    if (auth.user && (auth.user.id === project.userId || auth.user.role === 'admin')) {
      users = await User.query()
        .where('instance_id', project.instanceId)
        .orderBy('username', 'asc')
        .exec()
    }

    // Add visited status to project if user is authenticated and has visiteurPlus role
    if (auth.user && auth.user.role === 'visiteurPlus') {
      // Use the static method to set the isVisited property
      await Project.setVisitedStatus(project, auth.user.id)
    }

    return inertia.render('projects/show', { project, users })
  }
  async index({ inertia, request, auth }: HttpContext) {
    const status = request.input('status', 'all')
    const dimension = request.input('dimension', 'all')
    const tagId = request.input('tag_id', 'all')
    const visitedFilter = request.input('visited', 'all')

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

    // Sort projects by creation date in descending order (newest first)
    query = query.orderBy('created_at', 'desc')

    let projects = await query.exec()
    const tags = await Tag.all()

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

    return inertia.render('projects/index', {
      projects,
      tags,
      filters: { status, dimension, tagId, visited: visitedFilter },
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

    // Store the original status before updating
    const originalStatus = project.status

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

    // Check if status changed from "en_cours" to "termine"
    if (originalStatus === 'en_cours' && project.status === 'termine') {
      try {
        // Delete all records from users_visited_project for this project
        await UserVisitedProject.query().where('projectId', project.id).delete()
        console.log(
          `Deleted visited records for project ${project.id} after status change to "termine"`
        )
      } catch (error) {
        console.error('Error deleting visited project records:', error)
      }
    }

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
      query.preload('tag').orderBy('created_at', 'desc')
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
