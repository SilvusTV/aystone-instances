import React from 'react'
import { Head, Link } from '@inertiajs/react'
import Layout from '@/components/layout'
import { Instance } from '@/types'

interface InstancesIndexProps {
  instances: Instance[]
}

export default function InstancesIndex({ instances = [] }: InstancesIndexProps) {
  return (
    <Layout>
      <Head title="Instances" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Instances Aystone2</h1>
        <p className="text-lg">
          Découvrez les différentes instances du serveur Minecraft Aystone2.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instances.length > 0 ? (
          instances.map(instance => (
            <div key={instance.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition dark:border-gray-700">
              <div className="p-4 bg-primary-100 dark:bg-primary-900">
                <h3 className="text-xl font-bold">{instance.name}</h3>
              </div>

              <div className="p-4">
                <div className="flex justify-center mb-4">
                  {instance.image ? (
                    <img 
                      src={instance.image} 
                      alt={instance.name} 
                      className="w-24 h-24 object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400 text-xs">No img</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-center mt-4">
                  <Link
                    href={`/instances/${instance.name}`}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded transition"
                  >
                    Voir les détails
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-xl text-gray-500 dark:text-gray-400">Aucune instance disponible pour le moment.</p>
          </div>
        )}
      </div>
    </Layout>
  )
}
