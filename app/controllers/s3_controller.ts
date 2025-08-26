import { HttpContext } from '@adonisjs/core/http'
import s3Service from '#services/s3_service'
import env from '#start/env'
import { GetObjectCommand } from '@aws-sdk/client-s3'

export default class S3Controller {
  /**
   * Serve a file from S3 (single-level directory)
   */
  async serveFile({ params, response }: HttpContext) {
    try {
      // Extract the directory and filename from the params
      const directory = params.directory
      const filename = params.filename

      // Normalize directory path to prevent double slashes
      let normalizedDirectory = directory ? directory.trim() : ''
      // Remove trailing slash if it exists
      if (normalizedDirectory && normalizedDirectory.endsWith('/')) {
        normalizedDirectory = normalizedDirectory.slice(0, -1)
      }

      // Construct the key
      const key = normalizedDirectory ? `${normalizedDirectory}/${filename}` : filename

      return await this.sendObject(key, response)
    } catch (error) {
      console.error('Error serving file from S3:', error)
      return response.status(404).send('File not found')
    }
  }

  /**
   * Serve a file from S3 for two-level directories (e.g., /s3/user/services/file.webp)
   */
  async serveNestedFile({ params, response }: HttpContext) {
    try {
      const { dir1, dir2, filename } = params
      const key = `${dir1}/${dir2}/${filename}`
      return await this.sendObject(key, response)
    } catch (error) {
      console.error('Error serving nested file from S3:', error)
      return response.status(404).send('File not found')
    }
  }

  private async sendObject(key: string, response: HttpContext['response']) {
    const s3Client = s3Service.getClient()
    const bucket = s3Service.getBucket()

    const { Body, ContentType } = await s3Client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    )

    if (ContentType) {
      response.header('Content-Type', ContentType)
    }

    // @ts-ignore - Body has a transformToByteArray method
    const fileBuffer = await Body.transformToByteArray()
    return response.send(fileBuffer)
  }

  /**
   * Render the S3 management dashboard
   */
  async dashboard({ inertia }: HttpContext) {
    return inertia.render('dashboard/s3')
  }

  /**
   * List files and folders in a directory
   */
  async listFiles({ request, response }: HttpContext) {
    try {
      const prefix = request.input('prefix', '')
      const result = await s3Service.listFiles(prefix)
      return response.json(result)
    } catch (error) {
      console.error('Error listing files:', error)
      return response.status(500).json({ error: 'Failed to list files' })
    }
  }

  /**
   * Upload a file to S3
   */
  async uploadFile({ request, response }: HttpContext) {
    try {
      const file = request.file('file')
      const directory = request.input('directory', '')

      if (!file) {
        return response.status(400).json({ error: 'No file provided' })
      }

      const url = await s3Service.uploadFile(file, directory)
      return response.json({ url })
    } catch (error) {
      console.error('Error uploading file:', error)
      return response.status(500).json({ error: 'Failed to upload file' })
    }
  }

  /**
   * Delete a file from S3
   */
  async deleteFile({ request, response }: HttpContext) {
    try {
      const key = request.input('key')

      if (!key) {
        return response.status(400).json({ error: 'No file key provided' })
      }

      await s3Service.deleteFileByKey(key)
      return response.json({ success: true })
    } catch (error) {
      console.error('Error deleting file:', error)
      return response.status(500).json({ error: 'Failed to delete file' })
    }
  }

  /**
   * Create a folder in S3
   */
  async createFolder({ request, response }: HttpContext) {
    try {
      const folderPath = request.input('folderPath')

      if (!folderPath) {
        return response.status(400).json({ error: 'No folder path provided' })
      }

      await s3Service.createFolder(folderPath)
      return response.json({ success: true })
    } catch (error) {
      console.error('Error creating folder:', error)
      return response.status(500).json({ error: 'Failed to create folder' })
    }
  }

  /**
   * Rename a file in S3
   */
  async renameFile({ request, response }: HttpContext) {
    try {
      const oldKey = request.input('oldKey')
      const newName = request.input('newName')

      if (!oldKey) {
        return response.status(400).json({ error: 'No file key provided' })
      }

      if (!newName) {
        return response.status(400).json({ error: 'No new name provided' })
      }

      const newKey = await s3Service.renameFile(oldKey, newName)
      return response.json({ success: true, newKey })
    } catch (error) {
      console.error('Error renaming file:', error)
      return response.status(500).json({ error: 'Failed to rename file' })
    }
  }
}
