import Project from '#models/project'
import Tag from '#models/tag'
import { HttpContext } from '@adonisjs/core/http'

export default class ProjectsController {
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

  async create({ inertia }: HttpContext) {
    const tags = await Tag.all()
    return inertia.render('projects/create', { tags })
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
      'tag_id',
      'dynmap_url',
    ])

    await Project.create({
      userId: user.id,
      instanceId: user.instanceId,
      name: data.name,
      description: data.description,
      dimension: data.dimension,
      x: data.x,
      y: data.y,
      z: data.z,
      tagId: data.tag_id,
      dynmapUrl: data.dynmap_url || null,
      status: 'en_cours',
    })

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
}
