import { useState, useEffect, useCallback } from 'react'
import { Head, Link, usePage, router } from '@inertiajs/react'
import Layout from '@/components/layout'
import VisitButton from '@/components/VisitButton'
import TeleportCommand from '@/components/TeleportCommand'
import ToastDemo from '@/components/ToastDemo'
import { Project, Tag, Instance, PageProps } from '@/types'

// Helper function to capitalize dimension names
const formatDimension = (dimension: string): string => {
  if (dimension === 'overworld') return 'Overworld'
  if (dimension === 'nether') return 'Nether'
  return dimension.charAt(0).toUpperCase() + dimension.slice(1) // For other dimensions like 'end'
}

// Helper function to format dimension names for dynmap URLs
const formatDimensionForDynmap = (dimension: string): string => {
  if (dimension === 'nether') return 'world_nether'
  if (dimension === 'end') return 'world_the_end'
  return dimension // Keep 'overworld' as is
}

interface HomeProps {
  projects: Project[]
  tags: Tag[]
  instances: Instance[]
  filters?: {
    status: string
    dimension: string
    tagId: string | number
    instanceId: string | number
    visited: string
  }
}

export default function Home({ projects = [], tags = [], instances = [], filters = { status: 'all', dimension: 'all', tagId: 'all', instanceId: 'all', visited: 'all' } }: HomeProps) {
  // Get auth from page props
  const { auth } = usePage<PageProps>().props
  const isVisiteurPlus = auth.user?.role === 'visiteurPlus'
  
  // Debug: Log projects and their average ratings
  console.log('DEBUG: Number of projects received:', projects.length)
  projects.forEach(project => {
    console.log(`DEBUG: Project ${project.id} (${project.name}) - averageRating:`, project.averageRating)
  })

  // Initialize with default values
  const [statusFilter, setStatusFilter] = useState<'all' | 'en_cours' | 'termine'>('all')
  const [dimensionFilter, setDimensionFilter] = useState<'all' | 'overworld' | 'nether' | 'end'>('all')
  const [tagFilter, setTagFilter] = useState<number | 'all'>('all')
  const [instanceFilter, setInstanceFilter] = useState<number | 'all'>('all')
  const [visitedFilter, setVisitedFilter] = useState<'all' | 'visited' | 'not_visited'>('all')
  const [sortOrder, setSortOrder] = useState<'name_asc' | 'name_desc' | 'date_desc' | 'date_asc'>('name_asc')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [filterTimeout, setFilterTimeout] = useState<NodeJS.Timeout | null>(null)

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

    if (urlParams.get('sort')) {
      setSortOrder(urlParams.get('sort') as 'name_asc' | 'name_desc' | 'date_desc' | 'date_asc')
    }

    if (urlParams.get('search')) {
      setSearchTerm(urlParams.get('search') || '')
    }

    // Only handle visited filter if user is visiteurPlus
    if (isVisiteurPlus && urlParams.get('visited')) {
      setVisitedFilter(urlParams.get('visited') as 'all' | 'visited' | 'not_visited')
    }
    
    // Cleanup function to clear any pending timeouts when component unmounts
    return () => {
      if (filterTimeout) {
        clearTimeout(filterTimeout)
      }
    }
  }, [isVisiteurPlus]) // Remove filterTimeout from dependencies to prevent re-renders

  // Function to update URL with filter parameters - now with debouncing
  const updateFilters = useCallback(
    (
      status: 'all' | 'en_cours' | 'termine', 
      dimension: 'all' | 'overworld' | 'nether' | 'end',
      tag: number | 'all',
      instance: number | 'all',
      visited: 'all' | 'visited' | 'not_visited' = 'all',
      sort: 'name_asc' | 'name_desc' | 'date_desc' | 'date_asc' = 'name_asc',
      search: string = ''
    ) => {
      // Set loading state immediately
      setIsLoading(true)
      
      // Clear any existing timeout
      if (filterTimeout) {
        clearTimeout(filterTimeout)
      }
      
      // Update filter states immediately (this ensures filters apply on first selection)
      setStatusFilter(status)
      setDimensionFilter(dimension)
      setTagFilter(tag)
      setInstanceFilter(instance)
      setSortOrder(sort)
      setSearchTerm(search)
      if (isVisiteurPlus) {
        setVisitedFilter(visited)
      }
      
      // Create a new timeout for debouncing URL updates only
      const timeout = setTimeout(() => {
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

          // Set sort order
          url.searchParams.set('sort', sort)

          // Set search term
          if (search) {
            url.searchParams.set('search', search)
          } else {
            url.searchParams.delete('search')
          }

          // Only include visited filter if user is visiteurPlus
          if (isVisiteurPlus) {
            if (visited === 'all') {
              url.searchParams.delete('visited')
            } else {
              url.searchParams.set('visited', visited)
            }
          }

          // Use history API to update the URL without reloading the page
          window.history.pushState({}, '', url.toString())
          
          // Turn off loading state after URL is updated
          setIsLoading(false)
        }
      }, 300) // 300ms debounce delay
      
      // Save the timeout ID
      setFilterTimeout(timeout)
    },
    [isVisiteurPlus] // Remove filterTimeout from dependencies
  )

  // Client-side filtering for immediate feedback
  const filteredProjects = projects.filter(project => {
    if (statusFilter !== 'all' && project.status !== statusFilter) return false
    if (dimensionFilter !== 'all' && project.dimension !== dimensionFilter) return false
    if (tagFilter !== 'all' && project.tagId !== tagFilter) return false
    if (instanceFilter !== 'all' && project.instanceId !== instanceFilter) return false
    
    // Filter by search term
    if (searchTerm && !project.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
    
    // Only apply visited filter if user is visiteurPlus
    if (isVisiteurPlus && visitedFilter !== 'all') {
      const isVisited = visitedFilter === 'visited'
      if (project.isVisited !== isVisited) return false
    }
    
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
        <h2 className="text-xl font-semibold mb-4">
          Filtres
          {isLoading && (
            <span className="ml-2 inline-block">
              <svg className="animate-spin h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
          )}
        </h2>
        
        {/* Search input - spans full width */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un projet par nom..."
              value={searchTerm}
              onChange={(e) => {
                const newSearchTerm = e.target.value;
                updateFilters(
                  statusFilter,
                  dimensionFilter,
                  tagFilter,
                  instanceFilter,
                  visitedFilter,
                  sortOrder,
                  newSearchTerm
                );
              }}
              className="w-full p-2 pl-10 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            {searchTerm && (
              <button
                onClick={() => updateFilters(
                  statusFilter,
                  dimensionFilter,
                  tagFilter,
                  instanceFilter,
                  visitedFilter,
                  sortOrder,
                  ''
                )}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {/* Main filter grid with 6 columns for better alignment */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* First row - 3 filters that each span 2 columns on large screens */}
          <div className="lg:col-span-2">
            <label className="block mb-2">Statut</label>
            <select 
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              value={statusFilter}
              onChange={(e) => {
                const newStatus = e.target.value as 'all' | 'en_cours' | 'termine'
                // No need to call setStatusFilter here as updateFilters will handle it
                updateFilters(newStatus, dimensionFilter, tagFilter, instanceFilter, visitedFilter, sortOrder)
              }}
            >
              <option value="all">Tous</option>
              <option value="en_cours">En cours</option>
              <option value="termine">Terminé</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="block mb-2">Dimension</label>
            <select 
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              value={dimensionFilter}
              onChange={(e) => {
                const newDimension = e.target.value as 'all' | 'overworld' | 'nether' | 'end'
                // No need to call setDimensionFilter here as updateFilters will handle it
                updateFilters(statusFilter, newDimension, tagFilter, instanceFilter, visitedFilter, sortOrder)
              }}
            >
              <option value="all">Toutes</option>
              <option value="overworld">Overworld</option>
              <option value="nether">Nether</option>
              <option value="end">End</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="block mb-2">Tag</label>
            <select 
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              value={tagFilter}
              onChange={(e) => {
                const newTag = e.target.value === 'all' ? 'all' : Number(e.target.value)
                // No need to call setTagFilter here as updateFilters will handle it
                updateFilters(statusFilter, dimensionFilter, newTag, instanceFilter, visitedFilter, sortOrder)
              }}
            >
              <option value="all">Tous</option>
              {tags.map(tag => (
                <option key={tag.id} value={tag.id}>{tag.label}</option>
              ))}
            </select>
          </div>

          {/* Second row - 2 filters that each span 3 columns on large screens */}
          <div className="lg:col-span-3">
            <label className="block mb-2">Instance</label>
            <select 
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              value={instanceFilter}
              onChange={(e) => {
                const newInstance = e.target.value === 'all' ? 'all' : Number(e.target.value)
                // No need to call setInstanceFilter here as updateFilters will handle it
                updateFilters(statusFilter, dimensionFilter, tagFilter, newInstance, visitedFilter, sortOrder)
              }}
            >
              <option value="all">Toutes</option>
              {instances.map(instance => (
                <option key={instance.id} value={instance.id}>{instance.name}</option>
              ))}
            </select>
          </div>
          
          <div className="lg:col-span-3">
            <label className="block mb-2">Tri</label>
            <select 
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              value={sortOrder}
              onChange={(e) => {
                const newSortOrder = e.target.value as 'name_asc' | 'name_desc' | 'date_desc' | 'date_asc'
                // No need to call setSortOrder here as updateFilters will handle it
                updateFilters(statusFilter, dimensionFilter, tagFilter, instanceFilter, visitedFilter, newSortOrder)
              }}
            >
              <option value="name_asc">Nom (A-Z)</option>
              <option value="name_desc">Nom (Z-A)</option>
              <option value="date_desc">Date (récent)</option>
              <option value="date_asc">Date (ancien)</option>
            </select>
          </div>

          {/* Visited filter - only visible for visiteurPlus users - spans full width */}
          {isVisiteurPlus && (
            <div className="lg:col-span-6">
              <label className="block mb-2">Projets visités</label>
              <select 
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                value={visitedFilter}
                onChange={(e) => {
                  const newVisitedFilter = e.target.value as 'all' | 'visited' | 'not_visited'
                  // No need to call setVisitedFilter here as updateFilters will handle it
                  updateFilters(statusFilter, dimensionFilter, tagFilter, instanceFilter, newVisitedFilter, sortOrder)
                }}
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
              <div 
                className="p-4 relative"
                style={{
                  backgroundImage: project.instance?.name ? `url(/s3/instances/${project.instance.name}_texture.png)` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: project.status === 'en_cours' ? 'rgba(254, 240, 138, 0.8)' : 'rgba(187, 247, 208, 0.8)',
                }}
              >
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
                
                {/* Rating display for visiteurPlus users - positioned below visited status */}
                {isVisiteurPlus && (() => {
                  const rating = typeof project.averageRating === 'string' 
                    ? parseFloat(project.averageRating) 
                    : project.averageRating;
                  
                  const isValidRating = rating !== null && rating !== undefined && !isNaN(rating);
                  
                  return isValidRating && (
                    <div className="absolute top-10 right-2 flex items-center bg-yellow-400 bg-opacity-90 px-2 py-1 rounded-full z-20">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-sm font-bold text-white">
                        {rating.toFixed(1)}
                      </span>
                    </div>
                  );
                })()}
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      <a 
                        href={`/projects/${project.id}?from=home`} 
                        className="text-white hover:text-white hover:underline"
                        onClick={(e) => {
                          // If Ctrl/Cmd key is pressed, let the default behavior happen (open in new tab)
                          if (!e.ctrlKey && !e.metaKey) {
                            e.preventDefault();
                            // Use Inertia router for normal navigation
                            router.visit(`/projects/${project.id}?from=home`);
                          }
                        }}
                      >
                        {project.name}
                      </a>
                    </h3>
                    
                    {/* Rating display for non-visiteurPlus users - next to project title */}
                    {!isVisiteurPlus && (() => {
                      const rating = typeof project.averageRating === 'string' 
                        ? parseFloat(project.averageRating) 
                        : project.averageRating;
                      
                      const isValidRating = rating !== null && rating !== undefined && !isNaN(rating);
                      
                      return isValidRating && (
                        <div className="flex items-center bg-yellow-400 bg-opacity-90 px-2 py-1 rounded-full">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="ml-1 text-sm font-bold text-white">
                            {rating.toFixed(1)}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                  <p className="text-sm text-gray-800 dark:text-white">
                    Par {project.user?.username} • {formatDimension(project.dimension)} • {project.tag?.label}
                  </p>
                  <p className="text-sm text-gray-800 dark:text-white mt-1">
                    Instance: {project.instance?.name || 'Non spécifiée'}
                  </p>
                </div>
                <div className="absolute inset-0 bg-white dark:bg-black opacity-50 z-0"></div>
              </div>

              <div className="p-4">
                <p className="mb-4">{project.description.length > 100 ? `${project.description.substring(0, 100)}...` : project.description}</p>

                <div className="mb-4">
                  <span className="font-semibold">Coordonnées:</span> 
                  <div className="text-sm sm:text-base">
                    {isVisiteurPlus ? (
                      <TeleportCommand 
                        x={project.x} 
                        y={project.y} 
                        z={project.z} 
                        dimension={project.dimension} 
                      />
                    ) : (
                      <>X: {project.x}, Y: {project.y}, Z: {project.z}</>
                    )}
                  </div>
                </div>


                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className={`px-2 py-1 rounded text-sm inline-block ${
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

                  {(project.dynmapUrl || (project.instance?.name && project.x && project.z)) && (
                    <a 
                      href={project.dynmapUrl || `https://maps.aystone.fr/${project.instance?.name ? project.instance.name.toLowerCase() : ''}/#${formatDimensionForDynmap(project.dimension)}:${project.x}:64:${project.z}:153:0.03:0.83:0:0:perspective`} 
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
