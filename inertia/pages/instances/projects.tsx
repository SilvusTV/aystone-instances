import React, { useState } from 'react'
import { Head, Link, usePage } from '@inertiajs/react'
import Layout from '@/components/layout'
import VisitButton from '@/components/VisitButton'
import { Instance, Project, PageProps } from '@/types'

interface InstanceProjectsProps {
  instance: Instance
  projects: Project[]
}

export default function InstanceProjects({ instance, projects = [] }: InstanceProjectsProps) {
  // Get auth from page props
  const { auth } = usePage<PageProps>().props
  const isVisiteurPlus = auth.user?.role === 'visiteurPlus'

  const [statusFilter, setStatusFilter] = useState<'all' | 'en_cours' | 'termine'>('all')
  const [dimensionFilter, setDimensionFilter] = useState<'all' | 'overworld' | 'nether' | 'end'>('all')
  const [visitedFilter, setVisitedFilter] = useState<'all' | 'visited' | 'not_visited'>('all')

  const filteredProjects = projects.filter(project => {
    if (statusFilter !== 'all' && project.status !== statusFilter) return false
    if (dimensionFilter !== 'all' && project.dimension !== dimensionFilter) return false
    
    // Only apply visited filter if user is visiteurPlus
    if (isVisiteurPlus && visitedFilter !== 'all') {
      const isVisited = visitedFilter === 'visited'
      if (project.isVisited !== isVisited) return false
    }
    
    return true
  })

  return (
    <Layout>
      <Head title={`Projets - ${instance.name}`} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Projets de l'instance: {instance.name}</h1>
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
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Aperçu
          </Link>
          <Link
            href={`/instances/${instance.name}/projects`}
            className="px-4 py-2 rounded bg-primary-500 text-white hover:bg-primary-600 transition"
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

      <div className="mb-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Filtres</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Statut</label>
            <select 
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
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
              onChange={(e) => setDimensionFilter(e.target.value as any)}
            >
              <option value="all">Toutes</option>
              <option value="overworld">Overworld</option>
              <option value="nether">Nether</option>
              <option value="end">End</option>
            </select>
          </div>

          {/* Visited filter - only visible for visiteurPlus users */}
          {isVisiteurPlus && (
            <div className="md:col-span-2">
              <label className="block mb-2">Projets visités</label>
              <select 
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                value={visitedFilter}
                onChange={(e) => setVisitedFilter(e.target.value as any)}
              >
                <option value="all">Tous les projets</option>
                <option value="visited">Projets visités</option>
                <option value="not_visited">Projets non visités</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <div key={project.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition dark:border-gray-700">
              <div className={`p-4 relative ${project.status === 'en_cours' ? 'bg-yellow-100 dark:bg-yellow-900' : 'bg-green-100 dark:bg-green-900'}`}>
                {/* Visited status tag - only visible for visiteurPlus users */}
                {isVisiteurPlus && (
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold z-20 ${
                    project.isVisited 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {project.isVisited ? 'visité' : 'non visité'}
                  </div>
                )}
                <h3 className="text-xl font-bold">
                  <Link href={`/projects/${project.id}?from=instance_projects&instance=${instance.name}`} className="text-white hover:text-white hover:underline">
                    {project.name}
                  </Link>
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Par {project.user?.username} • {project.dimension} • {project.tag?.label}
                </p>
              </div>

              <div className="p-4">
                <p className="mb-4">{project.description.substring(0, 100)}...</p>

                <div className="mb-4">
                  <div><span className="font-semibold">Coordonnées:</span> X: {project.x}, Y: {project.y}, Z: {project.z}</div>
                  {(project.complementary_x !== null || project.complementary_y !== null || project.complementary_z !== null) && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Coordonnées complémentaires{project.dimension === 'overworld' ? ' (Nether)' : project.dimension === 'nether' ? ' (Overworld)' : ''}:</span> X: {project.complementary_x}, Y: {project.complementary_y}, Z: {project.complementary_z}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className={`px-2 py-1 rounded text-sm ${
                      project.status === 'en_cours' 
                        ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200' 
                        : 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
                    }`}>
                      {project.status === 'en_cours' ? 'En cours' : 'Terminé'}
                    </span>
                    
                    {/* Visit button - only visible for visiteurPlus users */}
                    {isVisiteurPlus && (
                      <VisitButton 
                        projectId={project.id} 
                        isVisited={project.isVisited || false} 
                      />
                    )}
                  </div>

                  {project.dynmapUrl && (
                    <a 
                      href={project.dynmapUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
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
