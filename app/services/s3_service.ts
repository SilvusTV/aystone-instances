import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  ListObjectsV2CommandOutput,
  CopyObjectCommand,
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

    // Normalize directory path to prevent double slashes
    let normalizedDirectory = directory ? directory.trim() : ''
    // Remove trailing slash if it exists
    if (normalizedDirectory && normalizedDirectory.endsWith('/')) {
      normalizedDirectory = normalizedDirectory.slice(0, -1)
    }

    const key = normalizedDirectory ? `${normalizedDirectory}/${fileName}` : fileName

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
   * Upload a raw Buffer to a specific key in S3
   */
  async uploadBuffer(buffer: Buffer, key: string, contentType: string = 'application/octet-stream'): Promise<string> {
    // Ensure the bucket exists
    await this.ensureBucketExists()

    // Normalize key (remove any leading slashes)
    if (key.startsWith('/')) {
      key = key.slice(1)
    }

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        ACL: 'public-read',
      })
    )

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    })

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

  /**
   * List files and folders in a directory
   * @param prefix The directory prefix to list (e.g., 'images/')
   * @returns An object containing files, folders, and the current prefix
   */
  async listFiles(prefix: string = ''): Promise<{
    files: Array<{ key: string; size: number; lastModified: Date; url: string }>
    folders: string[]
    prefix: string
  }> {
    // Ensure the bucket exists
    await this.ensureBucketExists()

    // Normalize the prefix to ensure it ends with a slash if not empty
    if (prefix && !prefix.endsWith('/')) {
      prefix = `${prefix}/`
    }

    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: prefix,
        Delimiter: '/',
      })

      const response: ListObjectsV2CommandOutput = await this.client.send(command)

      // Process files (Contents)
      const files = await Promise.all(
        (response.Contents || [])
          .filter((item) => item.Key !== prefix) // Filter out the directory itself
          .map(async (item) => {
            const key = item.Key!
            const size = item.Size || 0
            const lastModified = item.LastModified || new Date()

            // Generate a presigned URL for the file
            const url = await this.getPresignedUrl(key)

            return {
              key,
              size,
              lastModified,
              url,
            }
          })
      )

      // Process folders (CommonPrefixes)
      const folders = (response.CommonPrefixes || []).map((prefixItem) => {
        // Remove the trailing slash for display purposes
        const folderName = prefixItem.Prefix!
        return folderName
      })

      return {
        files,
        folders,
        prefix,
      }
    } catch (error) {
      console.error('Error listing files from S3:', error)
      throw error
    }
  }

  /**
   * Create a folder in S3
   * In S3, folders are just objects with keys that end with a slash
   * @param folderPath The path of the folder to create
   */
  async createFolder(folderPath: string): Promise<void> {
    // Ensure the bucket exists
    await this.ensureBucketExists()

    // Normalize the folder path to ensure it ends with a slash
    if (!folderPath.endsWith('/')) {
      folderPath = `${folderPath}/`
    }

    try {
      // Create an empty object with a key that ends with a slash
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: folderPath,
          Body: '',
          ContentType: 'application/x-directory',
          ACL: 'public-read',
        })
      )
    } catch (error) {
      console.error('Error creating folder in S3:', error)
      throw error
    }
  }

  /**
   * Rename a file in S3
   * In S3, renaming is done by copying the object to a new key and then deleting the old one
   * @param oldKey The current key of the file
   * @param newName The new name for the file (not the full key)
   * @returns The new key of the renamed file
   */
  async renameFile(oldKey: string, newName: string): Promise<string> {
    // Ensure the bucket exists
    await this.ensureBucketExists()

    try {
      // Extract the directory path from the old key
      const lastSlashIndex = oldKey.lastIndexOf('/')
      const directory = lastSlashIndex !== -1 ? oldKey.substring(0, lastSlashIndex + 1) : ''

      // Construct the new key by combining the directory and the new name
      const newKey = directory + newName

      // Copy the object to the new key
      await this.client.send(
        new CopyObjectCommand({
          Bucket: this.bucket,
          CopySource: `${this.bucket}/${oldKey}`,
          Key: newKey,
          ACL: 'public-read',
        })
      )

      // Delete the old object
      await this.deleteFileByKey(oldKey)

      return newKey
    } catch (error) {
      console.error('Error renaming file in S3:', error)
      throw error
    }
  }
}

export default new S3Service()
