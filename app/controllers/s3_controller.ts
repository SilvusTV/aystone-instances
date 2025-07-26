import { HttpContext } from '@adonisjs/core/http'
import s3Service from '#services/s3_service'

export default class S3Controller {
  /**
   * Serve a file from S3
   */
  async serveFile({ params, response }: HttpContext) {
    try {
      // Extract the directory and filename from the params
      const directory = params.directory
      const filename = params.filename

      // Construct the key
      const key = directory ? `${directory}/${filename}` : filename

      // Generate a presigned URL for the file
      const signedUrl = await s3Service.getPresignedUrl(key)

      // Redirect to the presigned URL
      return response.redirect(signedUrl)
    } catch (error) {
      console.error('Error serving file from S3:', error)
      return response.status(404).send('File not found')
    }
  }
}
