import { Head, Link } from '@inertiajs/react'
import Layout from '@/components/layout'
import InstanceNav from '@/components/InstanceNav'
import { Instance, InstanceDescription, Project } from '@/types'

interface InstanceShowProps {
  instance: Instance & { descriptions: InstanceDescription[] }
  projectStats: {
    total: number
    byStatus: { en_cours: number, termine: number }
    byDimension: { overworld: number, nether: number, end: number }
    byTag: { [key: string]: number }
  }
  canEdit: boolean
}

export default function InstanceShow({ instance, projectStats = { 
  total: 0, 
  byStatus: { en_cours: 0, termine: 0 }, 
  byDimension: { overworld: 0, nether: 0, end: 0 }, 
  byTag: {} 
}, canEdit }: InstanceShowProps) {
  return (
    <Layout>
      <Head title={`Instance ${instance.name}`} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Instance: {instance.name}</h1>
        <div className="flex justify-between items-center mb-4">
          <Link href="/instances" className="text-primary-600 hover:text-primary-800 dark:text-primary-400">
            &larr; Retour aux instances
          </Link>
          {canEdit && (
            <Link
              href={`/instances/${instance.name}/description/edit`}
              className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded transition"
            >
              Modifier la description
            </Link>
          )}
        </div>
      </div>

      <InstanceNav instanceName={instance.name} />

      {/* Description section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-primary-500 dark:border-primary-400 inline-block">Description</h2>
        
        {instance.descriptions && instance.descriptions.length > 0 ? (
          instance.descriptions.map((description) => (
            <div key={description.id} className="mb-8">
              <h3 className="text-xl font-bold mb-4">{description.title}</h3>
              <div className="prose dark:prose-invert max-w-none">
                {description.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-xl text-gray-500 dark:text-gray-400">
              Aucune description disponible pour cette instance.
            </p>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-primary-500 dark:border-primary-400 inline-block">Statistiques</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Projects Card */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Nombre de projets</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{projectStats.total}</p>
          </div>
          
          {/* Projects by Status */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Statut des projets</h3>
            <div className="flex justify-between items-center mt-2">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">En cours</p>
                <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{projectStats.byStatus.en_cours}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Terminés</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">{projectStats.byStatus.termine}</p>
              </div>
            </div>
          </div>
          
          {/* Projects by Dimension */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-purple-500">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Dimensions</h3>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Overworld</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">{projectStats.byDimension.overworld}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Nether</p>
                <p className="text-xl font-bold text-red-600 dark:text-red-400">{projectStats.byDimension.nether}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">End</p>
                <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{projectStats.byDimension.end}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick links */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Liens rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href={`/instances/${instance.name}/projects`}
            className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition flex items-center"
          >
            <span className="text-blue-600 dark:text-blue-300 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </span>
            Voir tous les projets de cette instance
          </Link>
          <Link
            href={`/instances/${instance.name}/members`}
            className="bg-green-100 dark:bg-green-900 p-4 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition flex items-center"
          >
            <span className="text-green-600 dark:text-green-300 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </span>
            Voir les membres de cette instance
          </Link>
        </div>
      </div>
    </Layout>
  )
}
