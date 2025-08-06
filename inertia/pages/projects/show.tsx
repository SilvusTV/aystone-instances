import { Head, Link, usePage, router } from '@inertiajs/react'
import { useState } from 'react'
import Layout from '@/components/layout'
import VisitButton from '@/components/VisitButton'
import RatingComponent from '@/components/RatingComponent'
import { Project, PageProps, User } from '@/types'

// Helper function to capitalize dimension names for display
const formatDimension = (dimension: string): string => {
  if (dimension === 'overworld') return 'Overworld'
  if (dimension === 'nether') return 'Nether'
  return dimension.charAt(0).toUpperCase() + dimension.slice(1) // For other dimensions like 'end'
}

// Helper function to format dimension names for dynmap URLs
const formatDimensionForDynmap = (dimension: string): string => {
  if (dimension === 'nether') return 'world_nether'
  if (dimension === 'end') return 'world_the_end'
  return dimension // Keep 'overworld' as is
}

interface ProjectShowProps extends PageProps {
  project: Project
  users?: User[]
  canRate?: boolean
}

export default function ProjectShow({ auth, project, users = [], canRate = false }: ProjectShowProps) {
  const [selectedUserId, setSelectedUserId] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Check if user has visiteurPlus role
  const isVisiteurPlus = auth.user?.role === 'visiteurPlus'

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
    // Filter out the project owner and existing collaborators
    user.id !== project.userId && 
    !project.collaborators?.some(collaborator => collaborator.id === user.id)
  )
  // Safely access window object only in browser environment
  let from = null;
  let instance = null;
  
  // Only run this code in the browser
  if (typeof window !== 'undefined') {
    const searchParams = new URLSearchParams(window.location.search);
    from = searchParams.get('from');
    instance = searchParams.get('instance');
  }

  // Determine the return URL and text based on the 'from' parameter
  let returnUrl = '/dashboard';
  let returnText = 'Retour au tableau de bord';
  if (from === 'home') {
    returnUrl = '#';
    returnText = 'Retour à l\'accueil';
  } else if (from === 'instance_projects' && instance) {
    returnUrl = `/instances/${instance}/projects`;
    returnText = `Retour aux projets de l'instance ${instance}`;
  }

  return (
    <Layout>
      <Head title={`Projet: ${project.name}`} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Projet: {project.name}</h1>
        <div className="flex justify-between items-center mb-4">
          {from === 'home' ? (
            <button 
              onClick={() => {
                // Safely access window.history only in browser environment
                if (typeof window !== 'undefined') {
                  // Try to navigate back
                  const currentHref = window.location.href;
                  
                  // Attempt to go back
                  window.history.back();
                  
                  // Check if navigation worked by setting a timeout
                  setTimeout(() => {
                    // If we're still on the same page after trying to go back,
                    // it means there was no history entry to go back to
                    if (window.location.href === currentHref) {
                      // Fallback to home page
                      router.visit('/');
                    }
                  }, 100);
                }
              }} 
              className="text-primary-600 hover:text-primary-800 dark:text-primary-400"
            >
              &larr; {returnText}
            </button>
          ) : (
            <Link href={returnUrl} className="text-primary-600 hover:text-primary-800 dark:text-primary-400">
              &larr; {returnText}
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-primary-500 dark:border-primary-400 inline-block text-gray-900 dark:text-white">Détails du projet</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg border-l-4 border border-primary-400 dark:border-primary-500 shadow-md transform transition-all hover:shadow-lg">
            <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-800 dark:text-gray-100">
              <span className="inline-block w-6 h-6 mr-2 text-primary-600 dark:text-primary-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              Informations générales
            </h3>
            <div className="space-y-3 pl-2 text-gray-700 dark:text-gray-200">
              <p><span className="font-medium text-gray-800 dark:text-gray-100">Nom:</span> {project.name}</p>
              <p>
                <span className="font-medium text-gray-800 dark:text-gray-100">Statut:</span> {project.status === 'en_cours' ? 'En cours' : 'Terminé'}
                {/* Visit button - only visible for visiteurPlus users */}
                {isVisiteurPlus && (
                  <span className="ml-3 inline-block">
                    <VisitButton 
                      projectId={project.id} 
                      isVisited={project.isVisited || false} 
                    />
                  </span>
                )}
              </p>
              <p><span className="font-medium text-gray-800 dark:text-gray-100">Créé par:</span> {project.user?.username}</p>
              <p><span className="font-medium text-gray-800 dark:text-gray-100">Catégorie:</span> {project.tag?.label || 'Non catégorisé'}</p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg border-l-4 border border-blue-400 dark:border-blue-500 shadow-md transform transition-all hover:shadow-lg">
            <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-800 dark:text-gray-100">
              <span className="inline-block w-6 h-6 mr-2 text-blue-600 dark:text-blue-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              Localisation
            </h3>
            <div className="space-y-3 pl-2 text-gray-700 dark:text-gray-200">
              <p><span className="font-medium text-gray-800 dark:text-gray-100">Dimension:</span> {formatDimension(project.dimension)}</p>
              <p><span className="font-medium text-gray-800 dark:text-gray-100">Coordonnées:</span> X: {project.x}, Y: {project.y}, Z: {project.z}</p>
              {(project.complementary_x !== null || project.complementary_y !== null || project.complementary_z !== null) && (
                <p><span className="font-medium text-gray-800 dark:text-gray-100">Coordonnées complémentaires{project.dimension === 'overworld' ? ' (Nether)' : project.dimension === 'nether' ? ' (Overworld)' : ''}:</span> X: {project.complementary_x}, Y: {project.complementary_y}, Z: {project.complementary_z}</p>
              )}
            </div>
          </div>
        </div>

        <div className="my-10 border-t-2 border-gray-200 dark:border-gray-600"></div>

        <div className="mb-10 bg-gray-50 dark:bg-gray-700 p-5 rounded-lg border-l-4 border border-green-400 dark:border-green-500 shadow-md transform transition-all hover:shadow-lg">
          <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-800 dark:text-gray-100">
            <span className="inline-block w-6 h-6 mr-2 text-green-600 dark:text-green-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            Description
          </h3>
          <div className="pl-2">
            <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-200">{project.description}</p>
          </div>
        </div>

        <div className="mb-10 bg-gray-50 dark:bg-gray-700 p-5 rounded-lg border-l-4 border border-yellow-400 dark:border-yellow-500 shadow-md transform transition-all hover:shadow-lg">
          <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-800 dark:text-gray-100">
            <span className="inline-block w-6 h-6 mr-2 text-yellow-600 dark:text-yellow-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </span>
            Évaluation
          </h3>
          <div className="pl-2 text-gray-700 dark:text-gray-200">
            <RatingComponent 
              projectId={project.id} 
              averageRating={project.averageRating} 
              canRate={canRate}
              userRating={project.userRating}
            />
          </div>
        </div>

        {(project.collaborators && project.collaborators.length > 0) || (auth.user && (auth.user.id === project.userId || auth.user.role === 'admin') && users.length > 0) ? (
          <div className="mb-10 bg-gray-50 dark:bg-gray-700 p-5 rounded-lg border-l-4 border border-purple-400 dark:border-purple-500 shadow-md transform transition-all hover:shadow-lg">
            {project.collaborators && project.collaborators.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800 dark:text-gray-100">
                  <span className="inline-block w-6 h-6 mr-2 text-purple-600 dark:text-purple-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                  Collaborateurs
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4 pl-2">
                  {project.collaborators.map((collaborator) => (
                    <div key={collaborator.id} className="flex items-center p-3 border rounded-lg bg-white dark:bg-gray-600 dark:border-gray-500 shadow-sm hover:shadow-md transition-shadow">
                      <img
                        src={`https://mineskin.eu/helm/${collaborator.username}`}
                        alt={collaborator.username}
                        className="w-10 h-10 rounded mr-3"
                      />
                      <div className="flex-grow">
                        <h4 className="font-medium text-gray-800 dark:text-gray-100">{collaborator.username}</h4>
                      </div>
                      {auth.user && (auth.user.id === project.userId || auth.user.role === 'admin') && (
                        <button
                          onClick={() => {
                            if (confirm(`Êtes-vous sûr de vouloir retirer ${collaborator.username} des collaborateurs ?`)) {
                              router.delete(`/projects/${project.id}/collaborators`, {
                                data: { user_id: collaborator.id },
                                preserveState: true,
                              })
                            }
                          }}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 ml-2"
                          title="Retirer ce collaborateur"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {auth.user && (auth.user.id === project.userId || auth.user.role === 'admin') && users.length > 0 && (
              <div className={`${project.collaborators && project.collaborators.length > 0 ? 'mt-6 pt-6 border-t-2 border-gray-200 dark:border-gray-600' : ''} pl-2`}>
                <h4 className="font-medium mb-3 flex items-center text-gray-800 dark:text-gray-100">
                  <span className="inline-block w-5 h-5 mr-2 text-purple-600 dark:text-purple-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </span>
                  Ajouter un collaborateur
                </h4>

                <div className="relative mb-3">
                  <input
                    type="text"
                    placeholder="Rechercher par pseudo MC"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {filteredUsers.length > 0 ? (
                  <div className="mb-3 max-h-60 overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {filteredUsers.map((user) => (
                        <div 
                          key={user.id} 
                          className="flex items-center p-2 border rounded cursor-pointer bg-white dark:bg-gray-600 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                          onClick={() => setSelectedUserId(user.id.toString())}
                        >
                          <img
                            src={`https://mineskin.eu/helm/${user.username}`}
                            alt={user.username}
                            className="w-8 h-8 rounded mr-2"
                          />
                          <span className="text-gray-800 dark:text-gray-100">{user.username}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mb-3 p-4 text-center bg-gray-100 dark:bg-gray-600 rounded text-gray-700 dark:text-gray-200">
                    {searchTerm ? "Aucun utilisateur ne correspond à votre recherche." : "Aucun utilisateur disponible à ajouter."}
                  </div>
                )}

                <div className="flex">
                  <button
                    onClick={() => {
                      if (selectedUserId) {
                        router.post(`/projects/${project.id}/collaborators`, {
                          user_id: selectedUserId,
                        }, {
                          preserveState: true,
                          onSuccess: () => {
                            setSelectedUserId('')
                            setSearchTerm('')
                          },
                        })
                      }
                    }}
                    disabled={!selectedUserId}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Ajouter le collaborateur sélectionné
                  </button>
                </div>

                {selectedUserId && (
                  <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    Utilisateur sélectionné: {users.find(u => u.id.toString() === selectedUserId)?.username}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : null}

        {auth.user && (auth.user.id === project.userId || auth.user.role === 'admin') && (
          <div className="flex space-x-2 mt-4">
            <Link
              href={`/projects/${project.id}/edit`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition shadow-sm"
            >
              Éditer
            </Link>
            <Link
              href={`/projects/${project.id}`}
              method="delete"
              as="button"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition shadow-sm"
              onClick={(e) => {
                if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
                  e.preventDefault()
                }
              }}
            >
              Supprimer
            </Link>
          </div>
        )}
      </div>

      {(project.dynmapUrl || (project.instance?.name && project.x && project.z)) && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mt-8">
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-primary-500 dark:border-primary-400 inline-block text-gray-900 dark:text-white">Carte Dynmap</h2>
          <div className="mb-10 bg-gray-50 dark:bg-gray-700 p-5 rounded-lg border-l-4 border border-teal-400 dark:border-teal-500 shadow-md transform transition-all hover:shadow-lg">
            <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-800 dark:text-gray-100">
              <span className="inline-block w-6 h-6 mr-2 text-teal-600 dark:text-teal-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </span>
              Visualisation interactive
            </h3>
            <div className="aspect-video w-full pl-2 pt-2">
              <iframe 
                src={project.dynmapUrl || `https://maps.aystone.fr/${project.instance?.name ? project.instance.name.toLowerCase() : ''}/#${formatDimensionForDynmap(project.dimension)}:${project.x}:64:${project.z}:153:0.03:0.83:0:0:perspective`} 
                className="w-full h-full border-0 rounded shadow"
                title={`Dynmap pour ${project.name}`}
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
