import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import env from '#start/env'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { Readable } from 'node:stream'

class S3Service {
  private client: S3Client
  private bucket: string

  constructor() {
    this.client = new S3Client({
      region: env.get('S3_REGION'),
      endpoint: env.get('S3_ENDPOINT'),
      credentials: {
        accessKeyId: env.get('S3_ACCESS_KEY'),
        secretAccessKey: env.get('S3_SECRET_KEY'),
      },
      forcePathStyle: env.get('S3_USE_PATH_STYLE_ENDPOINT', false),
    })
    this.bucket = env.get('S3_BUCKET')
  }

  /**
   * Get the S3 client
   */
  getClient(): S3Client {
    return this.client
  }

  /**
   * Get the bucket name
   */
  getBucket(): string {
    return this.bucket
  }

  /**
   * Ensure the bucket exists, creating it if necessary
   */
  async ensureBucketExists(): Promise<void> {
    try {
      // Check if the bucket exists
      await this.client.send(
        new HeadBucketCommand({
          Bucket: this.bucket,
        })
      )
      console.log(`Bucket ${this.bucket} exists`)
    } catch (error) {
      console.log(`Bucket ${this.bucket} does not exist, creating it...`)
      try {
        // Create the bucket
        await this.client.send(
          new CreateBucketCommand({
            Bucket: this.bucket,
          })
        )
        console.log(`Bucket ${this.bucket} created successfully`)
      } catch (createError) {
        console.error(`Error creating bucket ${this.bucket}:`, createError)
        throw createError
      }
    }
  }

  /**
   * Upload a file to S3
   */
  async uploadFile(file: MultipartFile, directory: string): Promise<string> {
    if (!file.tmpPath) {
      throw new Error('No temporary file path available')
    }

    // Ensure the bucket exists
    await this.ensureBucketExists()

    // Generate a unique name for the file
    const fileName = `${new Date().getTime()}_${file.clientName}`
    const key = directory ? `${directory}/${fileName}` : fileName

    // Read the file content from the temporary file
    const fileContent = await import('node:fs/promises').then((fs) => fs.readFile(file.tmpPath!))

    // Upload the file to S3
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: fileContent,
        ContentType: file.type || 'application/octet-stream',
        ACL: 'public-read', // Make the object publicly readable
      })
    )

    // Generate a presigned URL for the uploaded file
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    })

    // Generate a URL that expires in 7 days (604800 seconds)
    const signedUrl = await getSignedUrl(this.client, command, { expiresIn: 604800 })

    return signedUrl
  }

  /**
   * Generate a presigned URL for an existing object
   */
  async getPresignedUrl(key: string, expiresIn: number = 604800): Promise<string> {
    // Ensure the bucket exists
    await this.ensureBucketExists()

    // Generate a presigned URL for the object
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    })

    // Generate a URL that expires after the specified time (default: 7 days)
    const signedUrl = await getSignedUrl(this.client, command, { expiresIn })

    return signedUrl
  }

  /**
   * Delete a file from S3 by key
   */
  async deleteFileByKey(key: string): Promise<void> {
    // Ensure the bucket exists
    await this.ensureBucketExists()

    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        })
      )
      console.log(`Deleted file from S3: ${key}`)
    } catch (error) {
      console.error('Error deleting file from S3:', error)
      throw error
    }
  }

  /**
   * Delete a file from S3 by URL
   */
  async deleteFile(fileUrl: string): Promise<void> {
    // Extract the key from the URL
    // The URL could be a direct URL (http://localhost:9000/uploads/directory/filename)
    // or a presigned URL (http://localhost:9000/uploads/directory/filename?X-Amz-Algorithm=...)
    const urlParts = new URL(fileUrl)

    // Remove query parameters if present (for presigned URLs)
    const pathname = urlParts.pathname
    const pathParts = pathname.split('/')

    // Remove the first empty element and the bucket name
    pathParts.shift() // Remove empty element

    // Check if the next part is the bucket name
    if (pathParts[0] === this.bucket) {
      pathParts.shift() // Remove bucket name
    }

    const key = pathParts.join('/')

    // Delete the file by key
    await this.deleteFileByKey(key)
  }
}

export default new S3Service()
