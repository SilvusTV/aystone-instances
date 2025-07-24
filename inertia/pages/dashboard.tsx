import React from 'react'
import { Head, Link } from '@inertiajs/react'
import Layout from '@/components/layout'
import { Project, PageProps } from '@/types'

interface DashboardProps extends PageProps {
  projects: Project[]
}

export default function Dashboard({ auth = { user: null }, projects = [], flash }: DashboardProps) {
  return (
    <Layout>
      <Head title="Tableau de bord" />

      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Bienvenue, {auth.user?.username} !
            {auth.user?.role === 'invité' && (
              <span className="ml-2 text-yellow-600 dark:text-yellow-400">
                (Votre compte est en attente de validation)
              </span>
            )}
          </p>
        </div>

        {auth.user?.role !== 'invité' && (
          <Link
            href="/projects/create"
            className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded transition"
          >
            Nouveau projet
          </Link>
        )}
      </div>

      {flash?.success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {flash.success}
        </div>
      )}

      {flash?.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {flash.error}
        </div>
      )}

      {auth.user?.role === 'invité' ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Compte en attente de validation</h2>
          <p className="mb-4">
            Votre compte est actuellement en attente de validation par un administrateur.
            Une fois validé, vous pourrez créer et gérer vos projets.
          </p>
          <p>
            Pour accélérer le processus, rejoignez notre serveur Discord et contactez un administrateur.
            Plus d'informations sur la page <Link href="/about" className="text-primary-600 hover:text-primary-800 dark:text-primary-400">À propos</Link>.
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Mes projets</h2>

            {projects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Vous n'avez pas encore créé de projet.
                </p>
                <Link
                  href="/projects/create"
                  className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded transition"
                >
                  Créer mon premier projet
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="px-4 py-2 text-left">Nom</th>
                      <th className="px-4 py-2 text-left">Dimension</th>
                      <th className="px-4 py-2 text-left">Coordonnées</th>
                      <th className="px-4 py-2 text-left">Statut</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project.id} className="border-b dark:border-gray-700">
                        <td className="px-4 py-3">{project.name}</td>
                        <td className="px-4 py-3">{project.dimension}</td>
                        <td className="px-4 py-3">
                          X: {project.x}, Y: {project.y}, Z: {project.z}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              project.status === 'en_cours'
                                ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
                                : 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
                            }`}
                          >
                            {project.status === 'en_cours' ? 'En cours' : 'Terminé'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <Link
                              href={`/projects/${project.id}/edit`}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition"
                            >
                              Éditer
                            </Link>
                            <Link
                              href={`/projects/${project.id}`}
                              method="delete"
                              as="button"
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
                              onClick={(e) => {
                                if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
                                  e.preventDefault()
                                }
                              }}
                            >
                              Supprimer
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {auth.user?.role === 'instanceAdmin' && auth.user?.instanceId && (
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Administration d'instance</h2>
              <div className="flex space-x-4">
                <Link
                  href={`/instances/${auth.user.instanceId}/description/edit`}
                  className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition"
                >
                  Modifier la description de l'instance
                </Link>
              </div>
            </div>
          )}

          {auth.user?.role === 'admin' && (
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Administration</h2>
              <div className="flex space-x-4">
                <Link
                  href="/admin/users"
                  className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition"
                >
                  Gérer les utilisateurs
                </Link>
                <Link
                  href="/admin/instances"
                  className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition"
                >
                  Gérer les instances
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  )
}
