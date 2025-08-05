import { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'
import Tag from '#models/tag'
import Instance from '#models/instance'
import UserVisitedProject from '#models/user_visited_project'

export default class PagesController {
  async home({ inertia, request, auth }: HttpContext) {
    const status = request.input('status', 'all')
    const dimension = request.input('dimension', 'all')
    const tagId = request.input('tag_id', 'all')
    const instanceId = request.input('instance_id', 'all')
    const visitedFilter = request.input('visited', 'all')

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

    // Filter private projects - they should only be visible within their specific instance
    if (auth.user) {
      // If user is authenticated, show public projects and private projects from user's instance
      query = query.where((builder) => {
        builder.where('is_private', false).orWhere((subBuilder) => {
          subBuilder.where('is_private', true).where('instance_id', auth.user!.instanceId)
        })
      })
    } else {
      // If user is not authenticated, only show public projects
      query = query.where('is_private', false)
    }

    // Sort projects by creation date in descending order (newest first)
    query = query.orderBy('created_at', 'desc')

    let projects = await query.exec()
    const tags = await Tag.all()
    const instances = await Instance.all()

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

    return inertia.render('home_new', {
      projects,
      tags,
      instances,
      filters: { status, dimension, tagId, instanceId, visited: visitedFilter },
    })
  }

  async about({ inertia }: HttpContext) {
    return inertia.render('about')
  }

  async map({ response }: HttpContext) {
    // Redirect to the dynmap URL (this would be configured in an environment variable in a real app)
    return response.redirect('https://dynmap.aystone.fr')
  }
}
