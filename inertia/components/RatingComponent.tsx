import { useState } from 'react'
import { router } from '@inertiajs/react'

interface RatingComponentProps {
  projectId: number
  averageRating: number | null
  canRate: boolean
  userRating?: number | null
}

export default function RatingComponent({ projectId, averageRating, canRate, userRating = null }: RatingComponentProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(userRating)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const hasRated = userRating !== null

  // Function to handle rating submission
  const submitRating = () => {
    if (!selectedRating) {
      setError('Veuillez sélectionner une note')
      return
    }

    setIsSubmitting(true)
    setError(null)
    
    router.post(`/projects/${projectId}/ratings`, {
      rating: selectedRating
    }, {
      preserveState: true,
      onSuccess: () => {
        setSuccess('Votre note a été enregistrée')
        setIsSubmitting(false)
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(null)
        }, 3000)
      },
      onError: (errors) => {
        setError(errors.message || 'Une erreur est survenue')
        setIsSubmitting(false)
      }
    })
  }

  // Render stars for the average rating (read-only)
  const renderAverageRating = () => {
    // Convert averageRating to a number if it's a string
    const rating = typeof averageRating === 'string' 
      ? parseFloat(averageRating) 
      : averageRating;
    
    // Check if rating is a valid number (not null, undefined, or NaN)
    const isValidRating = rating !== null && rating !== undefined && !isNaN(rating);
    
    // Debug: Log the rating information
    console.log(`DEBUG: RatingComponent for project ${projectId}:`, {
      originalRating: averageRating,
      convertedRating: rating,
      isNull: rating === null,
      isUndefined: rating === undefined,
      isNaN: isNaN(rating),
      isValidRating: isValidRating
    });
    
    return (
      <div className="flex items-center">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => {
            // Determine if this star should be highlighted based on average rating
            const isRatedStar = isValidRating && star <= rating;
            
            // Apply styling to make the average rating visually distinct from user rating
            let starClass = 'w-5 h-5 ';
            
            if (isRatedStar) {
              // Average rating stars - use a different color than user rating
              starClass += 'text-blue-400'; // Blue color for average rating (vs yellow for user rating)
            } else {
              // Unrated stars
              starClass += 'text-gray-300 dark:text-gray-600';
            }
            
            return (
              <svg
                key={star}
                className={starClass}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            );
          })}
        </div>
        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {isValidRating ? `${rating.toFixed(1)}/5` : 'Aucune note'}
        </span>
        <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">(moyenne de tous les utilisateurs)</span>
      </div>
    )
  }

  // Render interactive stars for rating submission
  const renderRatingInput = () => {
    return (
      <div className="mt-2">
        {hasRated && (
          <div className="mb-2 text-sm font-medium text-blue-600 dark:text-blue-400">
            Vous avez déjà noté ce projet. Vous pouvez modifier votre note ci-dessous.
          </div>
        )}
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => {
            // Determine if this star should be highlighted based on user's previous rating
            const isUserRatedStar = userRating !== null && star <= userRating;
            // Determine if this star is selected in the current session
            const isSelectedStar = selectedRating !== null && star <= selectedRating;
            
            // Apply different styles based on whether the star is part of the user's rating
            // or currently selected
            let starClass = 'w-6 h-6 ';
            
            if (isSelectedStar) {
              // Currently selected stars
              starClass += 'text-yellow-400';
            } else if (isUserRatedStar) {
              // User's previous rating (not currently selected) - use a different color or style
              starClass += 'text-yellow-300 border-yellow-400 border-2 rounded-full';
            } else {
              // Unselected stars
              starClass += 'text-gray-300 dark:text-gray-600 hover:text-yellow-400 dark:hover:text-yellow-400';
            }
            
            return (
              <button
                key={star}
                type="button"
                onClick={() => setSelectedRating(star)}
                className={`${starClass} focus:outline-none transition-colors duration-150`}
                title={`${star} étoile${star > 1 ? 's' : ''}`}
              >
                <svg
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            );
          })}
          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {selectedRating ? `${selectedRating}/5` : userRating ? `Votre note actuelle: ${userRating}/5` : 'Sélectionnez une note'}
          </span>
        </div>

        <button
          type="button"
          onClick={submitRating}
          disabled={!selectedRating || isSubmitting}
          className="mt-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isSubmitting ? 'Envoi en cours...' : hasRated ? 'Modifier ma note' : 'Envoyer ma note'}
        </button>

        {error && (
          <div className="mt-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-2 text-sm text-green-600 dark:text-green-400">
            {success}
          </div>
        )}
      </div>
    )
  }

  // Render a read-only version of the user's rating if they've rated but can't rate anymore
  const renderUserRatingReadOnly = () => {
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Votre note</h3>
        <div className="flex items-center mt-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => {
              // Determine if this star should be highlighted based on user's rating
              const isUserRatedStar = userRating !== null && star <= userRating;
              
              // Apply special styling to make the user's rating more prominent
              let starClass = 'w-5 h-5 ';
              
              if (isUserRatedStar) {
                // User's rating - use the same distinctive style as in the interactive version
                starClass += 'text-yellow-400 border-yellow-400 border-2 rounded-full';
              } else {
                // Unrated stars
                starClass += 'text-gray-300 dark:text-gray-600';
              }
              
              return (
                <svg
                  key={star}
                  className={starClass}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              );
            })}
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {userRating ? `${userRating}/5` : 'Aucune note'}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Note moyenne</h3>
      {renderAverageRating()}
      
      {canRate ? (
        <>
          <h3 className="text-lg font-semibold mt-4">Noter ce projet</h3>
          {renderRatingInput()}
        </>
      ) : hasRated && (
        // Show read-only rating if user has rated but can't rate anymore
        renderUserRatingReadOnly()
      )}
    </div>
  )
}