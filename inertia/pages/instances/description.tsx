import React from 'react'
import { Head, Link } from '@inertiajs/react'
import Layout from '@/components/layout'
import { Instance, InstanceDescription, PageProps } from '@/types'

interface InstanceDescriptionPageProps extends PageProps {
  instance: Instance & { descriptions: InstanceDescription[] }
}

export default function InstanceDescriptionPage({ instance, auth }: InstanceDescriptionPageProps) {
  // Check if user is an instance admin for this instance or a global admin
  const canEdit = auth?.user && (
    auth.user.role === 'admin' || 
    (auth.user.role === 'instanceAdmin' && auth.user.instanceId === instance.id)
  )
  return (
    <Layout>
      <Head title={`Description - ${instance.name}`} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Description de l'instance: {instance.name}</h1>
        <div className="flex justify-between items-center mb-4">
          <Link href="/instances" className="text-primary-600 hover:text-primary-800 dark:text-primary-400">
            &larr; Retour aux instances
          </Link>
          {canEdit && (
            <Link
              href={`/instances/${instance.name}/description/edit`}
              className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded transition"
            >
              Modifier la description
            </Link>
          )}
        </div>
      </div>

      {/* Sub-navigation */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
        <nav className="flex flex-wrap gap-4">
          <Link
            href={`/instances/${instance.name}`}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Aperçu
          </Link>
          <Link
            href={`/instances/${instance.name}/projects`}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Projets
          </Link>
          <Link
            href={`/instances/${instance.name}/description`}
            className="px-4 py-2 rounded bg-primary-500 text-white hover:bg-primary-600 transition"
          >
            Description
          </Link>
          <Link
            href={`/instances/${instance.name}/members`}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Membres
          </Link>
          <Link
            href={`/instances/${instance.name}/dynmap`}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            DynMap
          </Link>
        </nav>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        {instance.descriptions && instance.descriptions.length > 0 ? (
          instance.descriptions.map((description) => (
            <div key={description.id} className="mb-8">
              <h2 className="text-2xl font-bold mb-4">{description.title}</h2>
              <div className="prose dark:prose-invert max-w-none">
                {description.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-xl text-gray-500 dark:text-gray-400">
              Aucune description disponible pour cette instance.
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}
