import React from 'react'
import { Head, useForm } from '@inertiajs/react'
import Layout from '@/components/layout'
import { Project, Tag, PageProps } from '@/types'

interface EditProjectProps extends PageProps {
  project: Project
  tags: Tag[]
}

export default function EditProject({ project, tags = [], flash }: EditProjectProps) {
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
    tag_id: project.tagId.toString(),
    dynmap_url: project.dynmapUrl || '',
    status: project.status,
  })

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
