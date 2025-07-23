import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'

export default class AdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    // Check if user is authenticated
    if (!ctx.auth.isAuthenticated) {
      return ctx.response.redirect('/login')
    }

    // Check if user is an admin
    if (ctx.auth.user!.role !== 'admin') {
      return ctx.response.redirect('/')
    }

    // User is an admin, proceed
    await next()
  }
}