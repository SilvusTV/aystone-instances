import { HttpContext } from '@adonisjs/core/http'
import Instance from '#models/instance'
import Project from '#models/project'
import User from '#models/user'
import InstanceDescription from '#models/instance_description'
import UserVisitedProject from '#models/user_visited_project'

export default class InstancesController {
  async index({ inertia }: HttpContext) {
    const instances = await Instance.all()
    return inertia.render('instances/index', { instances })
  }

  async show({ inertia, params }: HttpContext) {
    const instance = await Instance.findByOrFail('name', params.name)
    return inertia.render('instances/show', { instance })
  }

  async projects({ inertia, params, auth, request }: HttpContext) {
    const instance = await Instance.findByOrFail('name', params.name)
    const visitedFilter = request.input('visited', 'all')
    let projects = await Project.query()
      .where('instance_id', instance.id)
      .preload('user')
      .preload('tag')
      .orderBy('created_at', 'desc')
      .exec()

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
      filters: { visited: visitedFilter },
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

      session.flash('success', 'Description mise à jour avec succès')
      return response.redirect(`/instances/${instance.name}/description`)
    } catch (error) {
      console.error('Error updating instance description:', error)
      session.flash('error', 'Erreur lors de la mise à jour de la description')
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
}
