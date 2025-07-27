import { useState, useEffect } from 'react'
import { Head, Link } from '@inertiajs/react'
import Layout from '@/components/layout'
import { Project, Tag, Instance } from '@/types'

interface HomeProps {
  projects: Project[]
  tags: Tag[]
  instances: Instance[]
}

export default function Home({ projects = [], tags = [], instances = [] }: HomeProps) {
  // Initialize with default values
  const [statusFilter, setStatusFilter] = useState<'all' | 'en_cours' | 'termine'>('all')
  const [dimensionFilter, setDimensionFilter] = useState<'all' | 'overworld' | 'nether' | 'end'>('all')
  const [tagFilter, setTagFilter] = useState<number | 'all'>('all')
  const [instanceFilter, setInstanceFilter] = useState<number | 'all'>('all')

  // Use useEffect to handle browser-only code
  useEffect(() => {
    // This code only runs on the client after the component mounts
    const urlParams = new URLSearchParams(window.location.search)

    // Update state with URL parameters if they exist
    if (urlParams.get('status')) {
      setStatusFilter(urlParams.get('status') as 'all' | 'en_cours' | 'termine')
    }

    if (urlParams.get('dimension')) {
      setDimensionFilter(urlParams.get('dimension') as 'all' | 'overworld' | 'nether' | 'end')
    }

    if (urlParams.get('tag_id')) {
      setTagFilter(Number(urlParams.get('tag_id')))
    }

    if (urlParams.get('instance_id')) {
      setInstanceFilter(Number(urlParams.get('instance_id')))
    }
  }, [])

  // Function to update URL with filter parameters
  const updateFilters = (
    status: 'all' | 'en_cours' | 'termine', 
    dimension: 'all' | 'overworld' | 'nether' | 'end',
    tag: number | 'all',
    instance: number | 'all'
  ) => {
    // Only run this code in the browser
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)

      // Update URL parameters
      if (status === 'all') {
        url.searchParams.delete('status')
      } else {
        url.searchParams.set('status', status)
      }

      if (dimension === 'all') {
        url.searchParams.delete('dimension')
      } else {
        url.searchParams.set('dimension', dimension)
      }

      if (tag === 'all') {
        url.searchParams.delete('tag_id')
      } else {
        url.searchParams.set('tag_id', tag.toString())
      }

      if (instance === 'all') {
        url.searchParams.delete('instance_id')
      } else {
        url.searchParams.set('instance_id', instance.toString())
      }

      // Use history API to update the URL without reloading the page
      window.history.pushState({}, '', url.toString())

      // Optional: If you want to reload the page with the new filters
      // import { router } from '@inertiajs/react'
      // router.visit(url.toString(), { preserveState: true })
    }
  }

  // Client-side filtering for immediate feedback
  const filteredProjects = projects.filter(project => {
    if (statusFilter !== 'all' && project.status !== statusFilter) return false
    if (dimensionFilter !== 'all' && project.dimension !== dimensionFilter) return false
    if (tagFilter !== 'all' && project.tagId !== tagFilter) return false
    if (instanceFilter !== 'all' && project.instanceId !== instanceFilter) return false
    return true
  })

  return (
    <Layout>
      <Head title="Accueil" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Bienvenue sur les instances d'Aystone2</h1>
        <p className="text-lg">
          Découvrez les projets des joueurs des différentes instances du serveur Minecraft Aystone2.
        </p>
      </div>

      <div className="mb-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Filtres</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block mb-2">Statut</label>
            <select 
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              value={statusFilter}
              onChange={(e) => {
                const newStatus = e.target.value as 'all' | 'en_cours' | 'termine'
                setStatusFilter(newStatus)
                updateFilters(newStatus, dimensionFilter, tagFilter, instanceFilter)
              }}
            >
              <option value="all">Tous</option>
              <option value="en_cours">En cours</option>
              <option value="termine">Terminé</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">Dimension</label>
            <select 
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              value={dimensionFilter}
              onChange={(e) => {
                const newDimension = e.target.value as 'all' | 'overworld' | 'nether' | 'end'
                setDimensionFilter(newDimension)
                updateFilters(statusFilter, newDimension, tagFilter, instanceFilter)
              }}
            >
              <option value="all">Toutes</option>
              <option value="overworld">Overworld</option>
              <option value="nether">Nether</option>
              <option value="end">End</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">Tag</label>
            <select 
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              value={tagFilter}
              onChange={(e) => {
                const newTag = e.target.value === 'all' ? 'all' : Number(e.target.value)
                setTagFilter(newTag)
                updateFilters(statusFilter, dimensionFilter, newTag, instanceFilter)
              }}
            >
              <option value="all">Tous</option>
              {tags.map(tag => (
                <option key={tag.id} value={tag.id}>{tag.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">Instance</label>
            <select 
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              value={instanceFilter}
              onChange={(e) => {
                const newInstance = e.target.value === 'all' ? 'all' : Number(e.target.value)
                setInstanceFilter(newInstance)
                updateFilters(statusFilter, dimensionFilter, tagFilter, newInstance)
              }}
            >
              <option value="all">Toutes</option>
              {instances.map(instance => (
                <option key={instance.id} value={instance.id}>{instance.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <div key={project.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition dark:border-gray-700">
              <div 
                className="p-4 relative"
                style={{
                  backgroundImage: project.instance?.name ? `url(/s3/instances/${project.instance.name}_texture.png)` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: project.status === 'en_cours' ? 'rgba(254, 240, 138, 0.8)' : 'rgba(187, 247, 208, 0.8)',
                }}
              >
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    <Link href={`/projects/${project.id}?from=home`} className="text-white hover:text-white hover:underline">
                      {project.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-800 dark:text-white">
                    Par {project.user?.username} • {project.dimension} • {project.tag?.label}
                  </p>
                  <p className="text-sm text-gray-800 dark:text-white mt-1">
                    Instance: {project.instance?.name || 'Non spécifiée'}
                  </p>
                </div>
                <div className="absolute inset-0 bg-white dark:bg-black opacity-50 z-0"></div>
              </div>

              <div className="p-4">
                <p className="mb-4">{project.description.substring(0, 100)}...</p>

                <div className="mb-4">
                  <span className="font-semibold">Coordonnées:</span> 
                  <div className="text-sm sm:text-base">X: {project.x}, Y: {project.y}, Z: {project.z}</div>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <span className={`px-2 py-1 rounded text-sm inline-block ${
                    project.status === 'en_cours' 
                      ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200' 
                      : 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
                  }`}>
                    {project.status === 'en_cours' ? 'En cours' : 'Terminé'}
                  </span>

                  {project.dynmapUrl && (
                    <a 
                      href={project.dynmapUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm sm:text-base"
                    >
                      Voir sur la dynmap
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-xl text-gray-500 dark:text-gray-400">Aucun projet ne correspond à vos critères de recherche.</p>
          </div>
        )}
      </div>
    </Layout>
  )
}
