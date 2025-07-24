import { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'
import Tag from '#models/tag'
import Instance from '#models/instance'

export default class PagesController {
  async home({ inertia, request }: HttpContext) {
    const status = request.input('status', 'all')
    const dimension = request.input('dimension', 'all')
    const tagId = request.input('tag_id', 'all')
    const instanceId = request.input('instance_id', 'all')

    let query = Project.query().preload('user').preload('tag').preload('instance')

    if (status !== 'all') {
      query = query.where('status', status)
    }

    if (dimension !== 'all') {
      query = query.where('dimension', dimension)
    }

    if (tagId !== 'all') {
      query = query.where('tag_id', tagId)
    }

    if (instanceId !== 'all') {
      query = query.where('instance_id', instanceId)
    }

    const projects = await query.exec()
    const tags = await Tag.all()
    const instances = await Instance.all()

    return inertia.render('home_new', { projects, tags, instances })
  }

  async about({ inertia }: HttpContext) {
    return inertia.render('about')
  }

  async map({ response }: HttpContext) {
    // Redirect to the dynmap URL (this would be configured in an environment variable in a real app)
    return response.redirect('https://dynmap.aystone.fr')
  }
}
