import React, { useState } from 'react'
import { Head, useForm, router } from '@inertiajs/react'
import Layout from '@/components/layout'
import { Project, Tag, PageProps, User } from '@/types'

interface EditProjectProps extends PageProps {
  project: Project
  tags: Tag[]
  users?: User[]
}

export default function EditProject({ project, tags = [], users = [], flash, auth }: EditProjectProps) {
  const [selectedUserId, setSelectedUserId] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  
  const { data, setData, post, processing, errors } = useForm({
    name: project.name,
    description: project.description,
    dimension: project.dimension,
    x: project.x.toString(),
    y: project.y.toString(),
    z: project.z.toString(),
    complementary_x: project.complementary_x ? project.complementary_x.toString() : '',
    complementary_y: project.complementary_y ? project.complementary_y.toString() : '',
    complementary_z: project.complementary_z ? project.complementary_z.toString() : '',
    tag_id: project.tagId ? project.tagId.toString() : '',
    dynmap_url: project.dynmapUrl || '',
    status: project.status,
    is_private: project.isPrivate || false,
  })
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
    // Filter out the project owner and existing collaborators
    user.id !== project.userId && 
    !project.collaborators?.some(collaborator => collaborator.id === user.id)
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(`/projects/${project.id}`)
  }

  return (
    <Layout>
      <Head title="Modifier le projet" />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Modifier le projet</h1>

        {flash?.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {flash.error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-full">
                <label htmlFor="name" className="block mb-2">
                  Nom du projet <span className="text-red-500">*</span>
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

              <div className="col-span-full">
                <label htmlFor="description" className="block mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  rows={5}
                  className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 ${
                    errors.description ? 'border-red-500' : ''
                  }`}
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  required
                ></textarea>
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              <div>
                <label htmlFor="dimension" className="block mb-2">
                  Dimension <span className="text-red-500">*</span>
                </label>
                <select
                  id="dimension"
                  className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 ${
                    errors.dimension ? 'border-red-500' : ''
                  }`}
                  value={data.dimension}
                  onChange={(e) => setData('dimension', e.target.value)}
                  required
                >
                  <option value="overworld">Overworld</option>
                  <option value="nether">Nether</option>
                  <option value="end">End</option>
                </select>
                {errors.dimension && (
                  <p className="text-red-500 text-sm mt-1">{errors.dimension}</p>
                )}
              </div>

              <div>
                <label htmlFor="tag_id" className="block mb-2">
                  Type de projet <span className="text-red-500">*</span>
                </label>
                <select
                  id="tag_id"
                  className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 ${
                    errors.tag_id ? 'border-red-500' : ''
                  }`}
                  value={data.tag_id}
                  onChange={(e) => setData('tag_id', e.target.value)}
                  required
                >
                  <option value="">Sélectionner un type</option>
                  {tags.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.label}
                    </option>
                  ))}
                </select>
                {errors.tag_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.tag_id}</p>
                )}
              </div>

              <div>
                <label htmlFor="status" className="block mb-2">
                  Statut <span className="text-red-500">*</span>
                </label>
                <select
                  id="status"
                  className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 ${
                    errors.status ? 'border-red-500' : ''
                  }`}
                  value={data.status}
                  onChange={(e) => setData('status', e.target.value)}
                  required
                >
                  <option value="en_cours">En cours</option>
                  <option value="termine">Terminé</option>
                </select>
                {errors.status && (
                  <p className="text-red-500 text-sm mt-1">{errors.status}</p>
                )}
              </div>

              <div className="col-span-full">
                <h3 className="font-semibold mb-2">Coordonnées <span className="text-red-500">*</span></h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="x" className="block mb-2">X</label>
                    <input
                      id="x"
                      type="number"
                      className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 ${
                        errors.x ? 'border-red-500' : ''
                      }`}
                      value={data.x}
                      onChange={(e) => setData('x', e.target.value)}
                      required
                    />
                    {errors.x && (
                      <p className="text-red-500 text-sm mt-1">{errors.x}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="y" className="block mb-2">Y</label>
                    <input
                      id="y"
                      type="number"
                      className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 ${
                        errors.y ? 'border-red-500' : ''
                      }`}
                      value={data.y}
                      onChange={(e) => setData('y', e.target.value)}
                      required
                    />
                    {errors.y && (
                      <p className="text-red-500 text-sm mt-1">{errors.y}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="z" className="block mb-2">Z</label>
                    <input
                      id="z"
                      type="number"
                      className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 ${
                        errors.z ? 'border-red-500' : ''
                      }`}
                      value={data.z}
                      onChange={(e) => setData('z', e.target.value)}
                      required
                    />
                    {errors.z && (
                      <p className="text-red-500 text-sm mt-1">{errors.z}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <h3 className="font-semibold mb-2">Coordonnées complémentaires <span className="text-gray-500">(facultatif)</span></h3>
                <p className="text-gray-500 text-sm mb-2">
                  Si le monde est overworld, ces coordonnées seront celles du nether, et inversement.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="complementary_x" className="block mb-2">X</label>
                    <input
                      id="complementary_x"
                      type="number"
                      className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 ${
                        errors.complementary_x ? 'border-red-500' : ''
                      }`}
                      value={data.complementary_x}
                      onChange={(e) => setData('complementary_x', e.target.value)}
                    />
                    {errors.complementary_x && (
                      <p className="text-red-500 text-sm mt-1">{errors.complementary_x}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="complementary_y" className="block mb-2">Y</label>
                    <input
                      id="complementary_y"
                      type="number"
                      className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 ${
                        errors.complementary_y ? 'border-red-500' : ''
                      }`}
                      value={data.complementary_y}
                      onChange={(e) => setData('complementary_y', e.target.value)}
                    />
                    {errors.complementary_y && (
                      <p className="text-red-500 text-sm mt-1">{errors.complementary_y}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="complementary_z" className="block mb-2">Z</label>
                    <input
                      id="complementary_z"
                      type="number"
                      className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 ${
                        errors.complementary_z ? 'border-red-500' : ''
                      }`}
                      value={data.complementary_z}
                      onChange={(e) => setData('complementary_z', e.target.value)}
                    />
                    {errors.complementary_z && (
                      <p className="text-red-500 text-sm mt-1">{errors.complementary_z}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="dynmap_url" className="block mb-2">
                  Lien Dynmap <span className="text-gray-500">(facultatif)</span>
                </label>
                <input
                  id="dynmap_url"
                  type="url"
                  className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 ${
                    errors.dynmap_url ? 'border-red-500' : ''
                  }`}
                  value={data.dynmap_url}
                  onChange={(e) => setData('dynmap_url', e.target.value)}
                  placeholder="https://dynmap.aystone.fr/?..."
                />
                {errors.dynmap_url && (
                  <p className="text-red-500 text-sm mt-1">{errors.dynmap_url}</p>
                )}
                <p className="text-gray-500 text-sm mt-1">
                  Vous pouvez ajouter un lien direct vers votre projet sur la dynmap.
                </p>
              </div>

              <div className="col-span-full">
                <div className="flex items-center mb-4">
                  <input
                    id="is_private"
                    type="checkbox"
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    checked={data.is_private}
                    onChange={(e) => setData('is_private', e.target.checked)}
                  />
                  <label htmlFor="is_private" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Projet privé
                  </label>
                </div>
                <p className="text-gray-500 text-sm mb-4">
                  Si le projet est privé, il ne sera visible que sur la page des projets de votre instance. 
                  S'il est public, il sera visible sur toutes les instances.
                </p>
              </div>

              {/* Collaborators section */}
              {(project.collaborators && project.collaborators.length > 0) || (auth?.user && (auth.user.id === project.userId || auth.user.role === 'admin') && users.length > 0) ? (
                <div className="col-span-full mb-6 bg-gray-50 dark:bg-gray-700 p-5 rounded-lg border-l-4 border border-purple-400 dark:border-purple-500 shadow-md">
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
                            {auth?.user && (auth.user.id === project.userId || auth.user.role === 'admin') && (
                              <button
                                type="button"
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

                  {auth?.user && (auth.user.id === project.userId || auth.user.role === 'admin') && users.length > 0 && (
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
                            type="button"
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
                          type="button"
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

              <div className="col-span-full mt-4 flex justify-between">
                <a
                  href="/dashboard"
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition"
                >
                  Annuler
                </a>
                <button
                  type="submit"
                  disabled={processing}
                  className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded transition"
                >
                  {processing ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
