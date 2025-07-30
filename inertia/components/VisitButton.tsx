import React, { useState } from 'react'
import { router } from '@inertiajs/react'

interface VisitButtonProps {
  projectId: number
  isVisited: boolean
  className?: string
}

export default function VisitButton({ projectId, isVisited: initialIsVisited, className = '' }: VisitButtonProps) {
  const [isVisited, setIsVisited] = useState(initialIsVisited)
  const [isLoading, setIsLoading] = useState(false)

  const toggleVisitStatus = () => {
    setIsLoading(true)

    if (isVisited) {
      // Mark as not visited
      router.delete(`/projects/${projectId}/visit`, {
        onSuccess: () => {
          setIsVisited(false)
          setIsLoading(false)
        },
        onError: () => {
          setIsLoading(false)
        },
        preserveState: true,
      })
    } else {
      // Mark as visited
      router.post(`/projects/${projectId}/visit`, {}, {
        onSuccess: () => {
          setIsVisited(true)
          setIsLoading(false)
        },
        onError: () => {
          setIsLoading(false)
        },
        preserveState: true,
      })
    }
  }

  // Base button styles
  const baseClasses = "px-3 py-1 rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  // Visited/not visited specific styles
  const visitedClasses = isVisited
    ? "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500"
    : "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"

  return (
    <button
      onClick={toggleVisitStatus}
      disabled={isLoading}
      className={`${baseClasses} ${visitedClasses} ${className} ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
    >
      {isLoading ? (
        <span>Chargement...</span>
      ) : isVisited ? (
        <span>Visité ✓</span>
      ) : (
        <span>Marquer comme visité</span>
      )}
    </button>
  )
}