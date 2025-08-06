import React, { useState } from 'react'
import { Head, Link, useForm, router } from '@inertiajs/react'
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
  const [editingDescription, setEditingDescription] = useState<InstanceDescription | null>(null)
  
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    content: '',
  })
  
  const { data: editData, setData: setEditData, put, processing: editProcessing, errors: editErrors } = useForm({
    title: '',
    content: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(`/instances/${instance.name}/description`)
  }
  
  const handleEdit = (description: InstanceDescription) => {
    setEditingDescription(description)
    setEditData({
      title: description.title,
      content: description.content,
    })
  }
  
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingDescription) {
      put(`/instances/${instance.name}/description/${editingDescription.id}`, {
        onSuccess: () => {
          setEditingDescription(null)
        }
      })
    }
  }
  
  const handleDelete = (description: InstanceDescription) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette description ?')) {
      router.delete(`/instances/${instance.name}/description/${description.id}`)
    }
  }
  
  const cancelEdit = () => {
    setEditingDescription(null)
  }

  return (
    <Layout>
      <Head title={`Modifier la description - ${instance.name}`} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Modifier la description de l'instance: {instance.name}</h1>
        <div className="flex space-x-2 mb-4">
          <Link href={`/instances/${instance.name}`} className="text-primary-600 hover:text-primary-800 dark:text-primary-400">
            &larr; Retour à l'aperçu
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
              {editingDescription && editingDescription.id === description.id ? (
                // Edit form for existing description
                <form onSubmit={handleEditSubmit} className="mb-6">
                  <div className="mb-4">
                    <label htmlFor="edit-title" className="block mb-2">
                      Titre
                    </label>
                    <input
                      id="edit-title"
                      type="text"
                      className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 ${
                        editErrors.title ? 'border-red-500' : ''
                      }`}
                      value={editData.title}
                      onChange={(e) => setEditData('title', e.target.value)}
                      required
                    />
                    {editErrors.title && (
                      <p className="text-red-500 text-sm mt-1">{editErrors.title}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="edit-content" className="block mb-2">
                      Contenu
                    </label>
                    <textarea
                      id="edit-content"
                      rows={10}
                      className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 ${
                        editErrors.content ? 'border-red-500' : ''
                      }`}
                      value={editData.content}
                      onChange={(e) => setEditData('content', e.target.value)}
                      required
                    />
                    {editErrors.content && (
                      <p className="text-red-500 text-sm mt-1">{editErrors.content}</p>
                    )}
                    <p className="text-gray-500 text-sm mt-1">
                      Utilisez des sauts de ligne pour séparer les paragraphes.
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      disabled={editProcessing}
                      className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded transition"
                    >
                      {editProcessing ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              ) : (
                // Display description
                <>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold">{description.title}</h3>
                    {canEdit && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(description)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Modifier cette description"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(description)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          title="Supprimer cette description"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="prose dark:prose-invert max-w-none">
                    {description.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">{paragraph}</p>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500">
                    Ajouté le {new Date(description.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </>
              )}
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
