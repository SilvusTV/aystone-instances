import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'

export default class PlayerMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    // Check if user is authenticated
    if (!ctx.auth.isAuthenticated) {
      return ctx.response.redirect('/login')
    }

    // Check if user is a player, instanceAdmin, or admin
    if (
      ctx.auth.user!.role !== 'joueur' &&
      ctx.auth.user!.role !== 'instanceAdmin' &&
      ctx.auth.user!.role !== 'admin'
    ) {
      return ctx.response.redirect('/')
    }

    // User is a player, instanceAdmin, or admin, proceed
    await next()
  }
}
