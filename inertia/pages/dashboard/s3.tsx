import React, { useState, useEffect, useRef } from 'react'
import { Head } from '@inertiajs/react'
import axios from 'axios'
import Layout from '@/components/layout'

interface S3File {
  key: string
  size: number
  lastModified: Date
  url: string
}

interface S3Folder {
  name: string
  path: string
}

interface S3ListResponse {
  files: S3File[]
  folders: string[]
  prefix: string
}

export default function S3Dashboard() {
  const [currentPath, setCurrentPath] = useState<string>('')
  const [files, setFiles] = useState<S3File[]>([])
  const [folders, setFolders] = useState<S3Folder[]>([])
  const [breadcrumbs, setBreadcrumbs] = useState<{ name: string; path: string }[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [newFolderName, setNewFolderName] = useState<string>('')
  const [showNewFolderModal, setShowNewFolderModal] = useState<boolean>(false)
  const [showRenameModal, setShowRenameModal] = useState<boolean>(false)
  const [fileToRename, setFileToRename] = useState<{ key: string; name: string } | null>(null)
  const [newFileName, setNewFileName] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load files and folders when the component mounts or when the current path changes
  useEffect(() => {
    fetchFilesAndFolders()
  }, [currentPath])

  // Function to fetch files and folders from the API
  const fetchFilesAndFolders = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.get<S3ListResponse>('/api/s3/files', {
        params: { prefix: currentPath },
      })

      // Process files
      setFiles(response.data.files)

      // Process folders
      const processedFolders = response.data.folders.map((folderPath) => {
        // Extract folder name from the path
        const pathParts = folderPath.split('/')
        const folderName = pathParts[pathParts.length - 2] // Get the second-to-last part (last part is empty due to trailing slash)
        return {
          name: folderName,
          path: folderPath,
        }
      })
      setFolders(processedFolders)

      // Update breadcrumbs
      updateBreadcrumbs(currentPath)
    } catch (err) {
      console.error('Error fetching files and folders:', err)
      setError('Failed to load files and folders. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Function to update breadcrumbs based on the current path
  const updateBreadcrumbs = (path: string) => {
    const crumbs = [{ name: 'Home', path: '' }]

    if (path) {
      const pathParts = path.split('/')
      let currentPath = ''

      pathParts.forEach((part, index) => {
        if (part) {
          currentPath += part + '/'
          crumbs.push({
            name: part,
            path: currentPath,
          })
        }
      })
    }

    setBreadcrumbs(crumbs)
  }

  // Function to navigate to a folder
  const navigateToFolder = (folderPath: string) => {
    setCurrentPath(folderPath)
  }

  // Function to navigate using breadcrumbs
  const navigateToBreadcrumb = (path: string) => {
    setCurrentPath(path)
  }

  // Function to handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const formData = new FormData()
    formData.append('file', files[0])
    formData.append('directory', currentPath)

    try {
      setIsLoading(true)
      await axios.post('/api/s3/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // Refresh the file list
      fetchFilesAndFolders()

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      console.error('Error uploading file:', err)
      setError('Failed to upload file. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Function to delete a file
  const deleteFile = async (key: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return

    try {
      setIsLoading(true)
      await axios.delete('/api/s3/files', {
        params: { key },
      })

      // Refresh the file list
      fetchFilesAndFolders()
    } catch (err) {
      console.error('Error deleting file:', err)
      setError('Failed to delete file. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Function to create a new folder
  const createFolder = async () => {
    if (!newFolderName.trim()) {
      setError('Folder name cannot be empty')
      return
    }

    try {
      setIsLoading(true)
      const folderPath = currentPath ? `${currentPath}${newFolderName}` : newFolderName
      await axios.post('/api/s3/folders', {
        folderPath,
      })

      // Refresh the file list
      fetchFilesAndFolders()

      // Reset the form
      setNewFolderName('')
      setShowNewFolderModal(false)
    } catch (err) {
      console.error('Error creating folder:', err)
      setError('Failed to create folder. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Function to open the rename modal for a file
  const openRenameModal = (key: string, name: string) => {
    setFileToRename({ key, name })
    setNewFileName(name)
    setShowRenameModal(true)
  }

  // Function to rename a file
  const renameFile = async () => {
    if (!fileToRename) return

    if (!newFileName.trim()) {
      setError('File name cannot be empty')
      return
    }

    try {
      setIsLoading(true)
      await axios.put('/api/s3/files', {
        oldKey: fileToRename.key,
        newName: newFileName,
      })

      // Refresh the file list
      fetchFilesAndFolders()

      // Reset the form
      setFileToRename(null)
      setNewFileName('')
      setShowRenameModal(false)
    } catch (err) {
      console.error('Error renaming file:', err)
      setError('Failed to rename file. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Function to format date
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString()
  }

  return (
    <Layout>
      <Head title="S3 File Manager" />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">S3 File Manager</h1>

        {/* Breadcrumbs */}
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="inline-flex items-center">
                {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                <button
                  onClick={() => navigateToBreadcrumb(crumb.path)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {crumb.name}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setShowNewFolderModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            New Folder
          </button>

          <label className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer">
            Upload File
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={fetchFilesAndFolders}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Refresh
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Folders */}
        {!isLoading && folders.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Folders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {folders.map((folder) => (
                <div
                  key={folder.path}
                  onClick={() => navigateToFolder(folder.path)}
                  className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-6 h-6 text-yellow-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      ></path>
                    </svg>
                    <span className="truncate">{folder.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Files */}
        {!isLoading && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Files</h2>
            {files.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 border dark:border-gray-700">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="py-2 px-4 text-left">Name</th>
                      <th className="py-2 px-4 text-left">Size</th>
                      <th className="py-2 px-4 text-left">Last Modified</th>
                      <th className="py-2 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file) => {
                      // Extract filename from the key
                      const pathParts = file.key.split('/')
                      const fileName = pathParts[pathParts.length - 1]

                      return (
                        <tr key={file.key} className="border-t dark:border-gray-700">
                          <td className="py-2 px-4">
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              {fileName}
                            </a>
                          </td>
                          <td className="py-2 px-4">{formatFileSize(file.size)}</td>
                          <td className="py-2 px-4">{formatDate(file.lastModified)}</td>
                          <td className="py-2 px-4">
                            <div className="flex space-x-4">
                              <button
                                onClick={() => openRenameModal(file.key, fileName)}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                Rename
                              </button>
                              <button
                                onClick={() => deleteFile(file.key)}
                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No files found in this directory.</p>
            )}
          </div>
        )}

        {/* New Folder Modal */}
        {showNewFolderModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Create New Folder</h3>

              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Folder Name</label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter folder name"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowNewFolderModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={createFolder}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rename File Modal */}
        {showRenameModal && fileToRename && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Rename File</h3>

              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">New File Name</label>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter new file name"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowRenameModal(false)
                    setFileToRename(null)
                  }}
                  className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={renameFile}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Rename
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
