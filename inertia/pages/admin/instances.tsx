import React from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import Layout from '@/components/layout'
import { Instance, PageProps } from '@/types'

interface AdminInstancesProps extends PageProps {
  instances: Instance[]
}

export default function AdminInstances({ instances = [], flash }: AdminInstancesProps) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/admin/instances')
  }

  return (
    <Layout>
      <Head title="Gestion des instances" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gestion des instances</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Créez et gérez les instances du serveur Minecraft.
        </p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Créer une nouvelle instance</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2">
                Nom de l'instance
              </label>
              <input
                id="name"
                type="text"
                className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 ${
                  errors.name ? 'border-red-500' : ''
                }`}
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={processing}
              className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded transition"
            >
              {processing ? 'Création en cours...' : 'Créer l\'instance'}
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Instances existantes</h2>
          {instances.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {instances.map((instance) => (
                <li key={instance.id} className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-medium">{instance.name}</span>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      ID: {instance.id}
                    </div>
                  </div>
                  <div>
                    <Link
                      href={`/instances/${instance.id}`}
                      className="text-primary-600 hover:text-primary-800 dark:text-primary-400 mr-4"
                    >
                      Voir
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              Aucune instance n'a été créée pour le moment.
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex space-x-4">
        <Link
          href="/admin/users"
          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition"
        >
          Gestion des utilisateurs
        </Link>
        <Link
          href="/dashboard"
          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition"
        >
          Retour au tableau de bord
        </Link>
      </div>
    </Layout>
  )
}
