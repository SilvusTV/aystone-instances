import { HttpContext } from '@adonisjs/core/http'
import s3Service from '#services/s3_service'
import env from '#start/env'
import { GetObjectCommand } from '@aws-sdk/client-s3'

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

      // Get the S3 client from the service
      const s3Client = s3Service.getClient()
      const bucket = s3Service.getBucket()

      // Get the object from S3
      const { Body, ContentType } = await s3Client.send(
        new GetObjectCommand({
          Bucket: bucket,
          Key: key,
        })
      )

      // Set the content type if available
      if (ContentType) {
        response.header('Content-Type', ContentType)
      }

      // Stream the file directly to the response
      // @ts-ignore - Body has a transformToByteArray method
      const fileBuffer = await Body.transformToByteArray()
      return response.send(fileBuffer)
    } catch (error) {
      console.error('Error serving file from S3:', error)
      return response.status(404).send('File not found')
    }
  }
}
