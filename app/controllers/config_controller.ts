import { HttpContext } from '@adonisjs/core/http'
import Config from '#models/config'

export default class ConfigController {
  /**
   * Get a user configuration value
   */
  async get({ params, auth, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.status(401).json({ error: 'Unauthorized' })
    }

    const { key } = params
    const config = await Config.query().where('userId', user.id).where('key', key).first()

    return { value: config?.value || null }
  }

  /**
   * Save a user configuration value
   */
  async save({ request, auth, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.status(401).json({ error: 'Unauthorized' })
    }

    const { key, value } = request.body()

    // Find existing config or create a new one
    let config = await Config.query().where('userId', user.id).where('key', key).first()

    if (config) {
      // Update existing config
      config.value = value
      await config.save()
    } else {
      // Create new config
      config = await Config.create({
        userId: user.id,
        key,
        value,
      })
    }

    return { success: true, config }
  }
}
