import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'

export default class InstanceAdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    // Check if user is authenticated
    if (!ctx.auth.isAuthenticated) {
      return ctx.response.redirect('/login')
    }

    // Check if user is an instance admin
    if (ctx.auth.user!.role !== 'instanceAdmin' && ctx.auth.user!.role !== 'admin') {
      return ctx.response.redirect('/')
    }

    // If user is an admin, allow access to any instance
    if (ctx.auth.user!.role === 'admin') {
      return next()
    }

    // For instance admins, check if they belong to the instance they're trying to modify
    // If we have an instance name in the params, find the instance by name
    if (ctx.params.name) {
      const { default: Instance } = await import('#models/instance')
      try {
        const instance = await Instance.findByOrFail('name', ctx.params.name)

        // Check if the user belongs to this instance
        if (ctx.auth.user!.instanceId !== instance.id) {
          ctx.session?.flash(
            'error',
            "Vous ne pouvez modifier que l'instance à laquelle vous appartenez"
          )
          return ctx.response.redirect('/')
        }
      } catch (error) {
        ctx.session?.flash('error', 'Instance non trouvée')
        return ctx.response.redirect('/')
      }
    } else {
      // If we have an instance ID in the params, use that directly
      const instanceId = ctx.params.id ? Number.parseInt(ctx.params.id, 10) : null

      if (!instanceId || ctx.auth.user!.instanceId !== instanceId) {
        ctx.session?.flash(
          'error',
          "Vous ne pouvez modifier que l'instance à laquelle vous appartenez"
        )
        return ctx.response.redirect('/')
      }
    }

    // User is an instance admin for this instance, proceed
    await next()
  }
}
