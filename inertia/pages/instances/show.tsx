import React from 'react'
import { Head, Link } from '@inertiajs/react'
import Layout from '@/components/layout'
import { Instance } from '@/types'

interface InstanceShowProps {
  instance: Instance
}

export default function InstanceShow({ instance }: InstanceShowProps) {
  return (
    <Layout>
      <Head title={`Instance ${instance.name}`} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Instance: {instance.name}</h1>
        <div className="flex space-x-2 mb-4">
          <Link href="/instances" className="text-primary-600 hover:text-primary-800 dark:text-primary-400">
            &larr; Retour aux instances
          </Link>
        </div>
      </div>

      {/* Sub-navigation */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
        <nav className="flex flex-wrap gap-4">
          <Link
            href={`/instances/${instance.name}`}
            className="px-4 py-2 rounded bg-primary-500 text-white hover:bg-primary-600 transition"
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
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
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
        <h2 className="text-2xl font-bold mb-4">À propos de cette instance</h2>
        <p className="mb-4">
          Bienvenue sur la page de l'instance {instance.name}. Utilisez la navigation ci-dessus pour explorer les projets, 
          la description détaillée et les membres de cette instance.
        </p>
      </div>
    </Layout>
  )
}
