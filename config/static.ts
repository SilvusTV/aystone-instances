import { defineConfig } from '@adonisjs/static'

/**
 * Configuration options to tweak the static files middleware.
 * The complete set of options are documented on the
 * official documentation website.
 *
 * https://docs.adonisjs.com/guides/static-assets
 */
const staticServerConfig = defineConfig({
  enabled: true,
  etag: true,
  lastModified: true,
  dotFiles: 'ignore',
  // Add resources directory as a static files source
  // Ensure uploads directory is properly mapped for static file serving
  mappings: {
    '/resources': 'resources',
    '/resources/uploads': 'resources/uploads',
  },
})

export default staticServerConfig
