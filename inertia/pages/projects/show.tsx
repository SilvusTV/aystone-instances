import { Head, Link, usePage, router } from '@inertiajs/react'
import { useState } from 'react'
import Layout from '@/components/layout'
import { Project, PageProps, User } from '@/types'

interface ProjectShowProps extends PageProps {
  project: Project
  users?: User[]
}

export default function ProjectShow({ auth, project, users = [] }: ProjectShowProps) {
  const [selectedUserId, setSelectedUserId] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
    // Filter out the project owner and existing collaborators
    user.id !== project.userId && 
    !project.collaborators?.some(collaborator => collaborator.id === user.id)
  )
  const searchParams = new URLSearchParams(window.location.search);
  const from = searchParams.get('from');
  const instance = searchParams.get('instance');

  // Determine the return URL and text based on the 'from' parameter
  let returnUrl = '/dashboard';
  let returnText = 'Retour au tableau de bord';
  if (from === 'home') {
    returnUrl = '/';
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
          <Link href={returnUrl} className="text-primary-600 hover:text-primary-800 dark:text-primary-400">
            &larr; {returnText}
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Détails du projet</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Informations générales</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Nom:</span> {project.name}</p>
              <p><span className="font-medium">Statut:</span> {project.status === 'en_cours' ? 'En cours' : 'Terminé'}</p>
              <p><span className="font-medium">Créé par:</span> {project.user?.username}</p>
              <p><span className="font-medium">Catégorie:</span> {project.tag?.name || 'Non catégorisé'}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Localisation</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Dimension:</span> {project.dimension}</p>
              <p><span className="font-medium">Coordonnées:</span> X: {project.x}, Y: {project.y}, Z: {project.z}</p>
              {(project.complementary_x !== null || project.complementary_y !== null || project.complementary_z !== null) && (
                <p><span className="font-medium">Coordonnées complémentaires{project.dimension === 'overworld' ? ' (Nether)' : project.dimension === 'nether' ? ' (Overworld)' : ''}:</span> X: {project.complementary_x}, Y: {project.complementary_y}, Z: {project.complementary_z}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="whitespace-pre-wrap">{project.description}</p>
        </div>

        {(project.collaborators && project.collaborators.length > 0) || (auth.user && (auth.user.id === project.userId || auth.user.role === 'admin') && users.length > 0) ? (
          <div className="mb-6">
            {project.collaborators && project.collaborators.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mb-2">Collaborateurs</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {project.collaborators.map((collaborator) => (
                    <div key={collaborator.id} className="flex items-center p-3 border rounded-lg dark:border-gray-700">
                      <img
                        src={`https://mineskin.eu/helm/${collaborator.username}`}
                        alt={collaborator.username}
                        className="w-10 h-10 rounded mr-3"
                      />
                      <div className="flex-grow">
                        <h4 className="font-medium">{collaborator.username}</h4>
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
                          className="text-red-600 hover:text-red-800 ml-2"
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
              <div className={`${project.collaborators && project.collaborators.length > 0 ? 'mt-4' : ''} p-4 border rounded-lg dark:border-gray-700`}>
                <h4 className="font-medium mb-2">Ajouter un collaborateur</h4>

                <div className="relative mb-3">
                  <input
                    type="text"
                    placeholder="Rechercher par pseudo MC"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
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
                          className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setSelectedUserId(user.id.toString())}
                        >
                          <img
                            src={`https://mineskin.eu/helm/${user.username}`}
                            alt={user.username}
                            className="w-8 h-8 rounded mr-2"
                          />
                          <span>{user.username}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mb-3 p-4 text-center bg-gray-100 dark:bg-gray-700 rounded">
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
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            >
              Éditer
            </Link>
            <Link
              href={`/projects/${project.id}`}
              method="delete"
              as="button"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
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

      {project.dynmapUrl && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Carte Dynmap</h2>
          <div className="aspect-video w-full">
            <iframe 
              src={project.dynmapUrl} 
              className="w-full h-full border-0 rounded"
              title={`Dynmap pour ${project.name}`}
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </Layout>
  )
}
