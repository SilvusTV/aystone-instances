import React, { useState } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import Layout from '@/components/layout'
import { Instance, InstanceDescription, PageProps } from '@/types'

interface EditInstanceDescriptionPageProps extends PageProps {
  instance: Instance & { descriptions: InstanceDescription[] }
  canEdit: boolean
}

export default function EditInstanceDescriptionPage({ 
  instance, 
  canEdit, 
  flash 
}: EditInstanceDescriptionPageProps) {
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    content: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(`/instances/${instance.name}/description`)
  }

  return (
    <Layout>
      <Head title={`Modifier la description - ${instance.name}`} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Modifier la description de l'instance: {instance.name}</h1>
        <div className="flex space-x-2 mb-4">
          <Link href={`/instances/${instance.name}/description`} className="text-primary-600 hover:text-primary-800 dark:text-primary-400">
            &larr; Retour à la description
          </Link>
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
        </nav>
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

      {!canEdit ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          Vous n'avez pas les droits pour modifier la description de cette instance.
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">Ajouter une nouvelle description</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block mb-2">
                Titre
              </label>
              <input
                id="title"
                type="text"
                className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 ${
                  errors.title ? 'border-red-500' : ''
                }`}
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
                required
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="content" className="block mb-2">
                Contenu
              </label>
              <textarea
                id="content"
                rows={10}
                className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 ${
                  errors.content ? 'border-red-500' : ''
                }`}
                value={data.content}
                onChange={(e) => setData('content', e.target.value)}
                required
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                Utilisez des sauts de ligne pour séparer les paragraphes.
              </p>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded transition"
            >
              {processing ? 'Enregistrement...' : 'Enregistrer la description'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Descriptions existantes</h2>
        {instance.descriptions && instance.descriptions.length > 0 ? (
          instance.descriptions.map((description) => (
            <div key={description.id} className="mb-8 border-b pb-4">
              <h3 className="text-lg font-bold mb-2">{description.title}</h3>
              <div className="prose dark:prose-invert max-w-none">
                {description.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
              <div className="text-sm text-gray-500">
                Ajouté le {new Date(description.createdAt).toLocaleDateString('fr-FR')}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 dark:text-gray-400">
              Aucune description disponible pour cette instance.
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}
