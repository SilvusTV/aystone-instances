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
  // Images are now stored in S3, so we only need to map the resources directory
  mappings: {
    '/resources': 'resources',
  },
})

export default staticServerConfig
