import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'

/**
 * Silent auth middleware checks if the user is authenticated
 * without redirecting or failing if they are not.
 */
export default class SilentAuthMiddleware {
  public async handle(ctx: HttpContext, next: NextFn) {
    // Check authentication silently without throwing exceptions
    await ctx.auth.check()

    // Proceed to next middleware regardless of authentication status
    return next()
  }
}
