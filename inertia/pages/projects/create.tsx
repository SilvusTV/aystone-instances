import React, { useState } from 'react'
import { Head, useForm } from '@inertiajs/react'
import Layout from '@/components/layout'
import { Tag, PageProps, User } from '@/types'

interface CreateProjectProps extends PageProps {
  tags: Tag[]
  users: User[]
}

export default function CreateProject({ tags = [], users = [], flash }: CreateProjectProps) {
  const [selectedCollaborators, setSelectedCollaborators] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
    dimension: 'overworld',
    x: '',
    y: '',
    z: '',
    complementary_x: '',
    complementary_y: '',
    complementary_z: '',
    tag_id: '',
    dynmap_url: '',
    collaborators: [] as string[],
    is_private: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Update the collaborators field with the selected collaborators
    setData('collaborators', selectedCollaborators)
    post('/projects')
  }

  const toggleCollaborator = (userId: string) => {
    setSelectedCollaborators(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId)
      } else {
        return [...prev, userId]
      }
    })
  }

  return (
    <Layout>
      <Head title="Créer un projet" />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Créer un nouveau projet</h1>

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
                <div className="flex justify-between items-center mb-2">
                  <label className="block">
                    Collaborateurs <span className="text-gray-500">(facultatif)</span>
                  </label>
                </div>

                {users.length > 0 ? (
                  <>
                    <div className="relative mb-2">
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                        {filteredUsers.map((user) => (
                          <div 
                            key={user.id} 
                            className={`flex items-center p-2 border rounded cursor-pointer ${
                              selectedCollaborators.includes(user.id.toString()) 
                                ? 'bg-primary-100 dark:bg-primary-900 border-primary-300 dark:border-primary-700' 
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                            }`}
                            onClick={() => toggleCollaborator(user.id.toString())}
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
                    ) : (
                      <p className="text-center py-4 bg-gray-100 dark:bg-gray-700 rounded">
                        {searchTerm ? "Aucun utilisateur ne correspond à votre recherche." : "Aucun utilisateur disponible."}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">Aucun utilisateur disponible.</p>
                )}

                <p className="text-gray-500 text-sm mt-1">
                  Cliquez sur un utilisateur pour l'ajouter ou le retirer des collaborateurs.
                </p>

                {selectedCollaborators.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium">Collaborateurs sélectionnés: {selectedCollaborators.length}</p>
                  </div>
                )}
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

              <div className="col-span-full mt-4">
                <button
                  type="submit"
                  disabled={processing}
                  className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded transition"
                >
                  {processing ? 'Création en cours...' : 'Créer le projet'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
