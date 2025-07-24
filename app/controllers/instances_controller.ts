import { HttpContext } from '@adonisjs/core/http'
import Instance from '#models/instance'
import Project from '#models/project'
import User from '#models/user'
import InstanceDescription from '#models/instance_description'

export default class InstancesController {
  async index({ inertia }: HttpContext) {
    const instances = await Instance.all()
    return inertia.render('instances/index', { instances })
  }

  async show({ inertia, params }: HttpContext) {
    const instance = await Instance.findOrFail(params.id)
    return inertia.render('instances/show', { instance })
  }

  async projects({ inertia, params }: HttpContext) {
    const instance = await Instance.findOrFail(params.id)
    const projects = await Project.query()
      .where('instance_id', instance.id)
      .preload('user')
      .preload('tag')
      .exec()

    return inertia.render('instances/projects', { instance, projects })
  }

  async description({ inertia, params, auth }: HttpContext) {
    const instance = await Instance.findOrFail(params.id)
    await instance.load('descriptions')

    // Auth is automatically passed to the view by the inertia middleware
    return inertia.render('instances/description', { instance })
  }

  async editDescription({ inertia, params, auth }: HttpContext) {
    const instance = await Instance.findOrFail(params.id)
    await instance.load('descriptions')

    // Check if user is an instance admin for this instance or a global admin
    const canEdit =
      auth.user!.role === 'admin' ||
      (auth.user!.role === 'instanceAdmin' && auth.user!.instanceId === instance.id)

    return inertia.render('instances/edit_description', { instance, canEdit })
  }

  async updateDescription({ params, request, response, session }: HttpContext) {
    const instance = await Instance.findOrFail(params.id)
    const { title, content } = request.only(['title', 'content'])

    try {
      // Create a new description entry
      await InstanceDescription.create({
        instanceId: instance.id,
        title,
        content,
      })

      session.flash('success', 'Description mise à jour avec succès')
      return response.redirect(`/instances/${instance.id}/description`)
    } catch (error) {
      console.error('Error updating instance description:', error)
      session.flash('error', 'Erreur lors de la mise à jour de la description')
      return response.redirect().back()
    }
  }

  async members({ inertia, params }: HttpContext) {
    const instance = await Instance.findOrFail(params.id)
    const projects = await Project.query().where('instance_id', instance.id).preload('user').exec()

    // Get unique users from projects
    const userIds = [...new Set(projects.map((project) => project.userId))]
    const members = await User.query().whereIn('id', userIds).exec()

    return inertia.render('instances/members', { instance, members })
  }
}
