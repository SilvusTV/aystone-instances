import type { HttpContext } from '@adonisjs/core/http'
import UserVisitedProject from '#models/user_visited_project'
import Project from '#models/project'

export default class ProjectVisitsController {
  /**
   * Mark a project as visited by the authenticated user
   */
  async markAsVisited({ params, auth, response }: HttpContext) {
    try {
      // Check if user is authenticated and has the visiteurPlus role
      const user = auth.user
      if (!user) {
        return response.unauthorized('You must be logged in to mark projects as visited')
      }

      if (user.role !== 'visiteurPlus') {
        return response.forbidden('Only visiteurPlus users can mark projects as visited')
      }

      const projectId = params.id
      
      // Check if project exists
      const project = await Project.find(projectId)
      if (!project) {
        return response.notFound('Project not found')
      }

      // Check if the project is already marked as visited
      const existingVisit = await UserVisitedProject.query()
        .where('userId', user.id)
        .where('projectId', projectId)
        .first()

      if (existingVisit) {
        // Update the existing record
        existingVisit.isVisited = true
        await existingVisit.save()
      } else {
        // Create a new record
        await UserVisitedProject.create({
          userId: user.id,
          projectId,
          isVisited: true,
        })
      }

      return response.redirect().back()
    } catch (error) {
      console.error('Error marking project as visited:', error)
      return response.internalServerError('An error occurred while marking the project as visited')
    }
  }

  /**
   * Mark a project as not visited by the authenticated user
   */
  async markAsNotVisited({ params, auth, response }: HttpContext) {
    try {
      // Check if user is authenticated and has the visiteurPlus role
      const user = auth.user
      if (!user) {
        return response.unauthorized('You must be logged in to mark projects as not visited')
      }

      if (user.role !== 'visiteurPlus') {
        return response.forbidden('Only visiteurPlus users can mark projects as not visited')
      }

      const projectId = params.id
      
      // Check if project exists
      const project = await Project.find(projectId)
      if (!project) {
        return response.notFound('Project not found')
      }

      // Check if the project is marked as visited
      const existingVisit = await UserVisitedProject.query()
        .where('userId', user.id)
        .where('projectId', projectId)
        .first()

      if (existingVisit) {
        // Update the existing record
        existingVisit.isVisited = false
        await existingVisit.save()
      } else {
        // Create a new record with isVisited = false
        await UserVisitedProject.create({
          userId: user.id,
          projectId,
          isVisited: false
        })
      }

      return response.redirect().back()
    } catch (error) {
      console.error('Error marking project as not visited:', error)
      return response.internalServerError('An error occurred while marking the project as not visited')
    }
  }

  /**
   * Get the visited status of a project for the authenticated user
   */
  async getVisitStatus({ params, auth, response }: HttpContext) {
    try {
      // Check if user is authenticated
      const user = auth.user
      if (!user) {
        return response.unauthorized('You must be logged in to get project visit status')
      }

      const projectId = params.id
      
      // Check if project exists
      const project = await Project.find(projectId)
      if (!project) {
        return response.notFound('Project not found')
      }

      // Get the visit status
      const visitRecord = await UserVisitedProject.query()
        .where('userId', user.id)
        .where('projectId', projectId)
        .first()

      const isVisited = visitRecord ? visitRecord.isVisited : false

      return response.ok({ isVisited })
    } catch (error) {
      console.error('Error getting project visit status:', error)
      return response.internalServerError('An error occurred while getting the project visit status')
    }
  }

  /**
   * Get all visited projects for the authenticated user
   */
  async getVisitedProjects({ auth, response }: HttpContext) {
    try {
      // Check if user is authenticated
      const user = auth.user
      if (!user) {
        return response.unauthorized('You must be logged in to get visited projects')
      }

      // Get all visited projects
      const visitedProjects = await UserVisitedProject.query()
        .where('userId', user.id)
        .where('isVisited', true)
        .preload('project')

      return response.ok({ 
        visitedProjects: visitedProjects.map(visit => visit.project) 
      })
    } catch (error) {
      console.error('Error getting visited projects:', error)
      return response.internalServerError('An error occurred while getting visited projects')
    }
  }
}
