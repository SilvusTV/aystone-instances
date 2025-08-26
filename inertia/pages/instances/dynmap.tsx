import React from 'react'
import { Head, Link } from '@inertiajs/react'
import Layout from '@/components/layout'
import InstanceNav from '@/components/InstanceNav'
import { Instance, PageProps } from '@/types'

interface InstanceDynMapPageProps extends PageProps {
  instance: Instance
}

export default function InstanceDynMapPage({ instance, auth }: InstanceDynMapPageProps) {
  // Create the map URL with lowercase instance name
  const mapUrl = `https://maps.aystone.fr/${instance.name.toLowerCase()}`

  return (
    <Layout>
      <Head title={`DynMap - ${instance.name}`} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">DynMap de l'instance: {instance.name}</h1>
        <div className="flex justify-between items-center mb-4">
          <Link href="/instances" className="text-primary-600 hover:text-primary-800 dark:text-primary-400">
            &larr; Retour aux instances
          </Link>
        </div>
      </div>

      <InstanceNav instanceName={instance.name} />

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Carte dynamique de l'instance</h2>

        <div className="mb-6">
          <a 
            href={mapUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded transition inline-block"
          >
            Ouvrir la carte dans un nouvel onglet
          </a>
        </div>

        <div className="w-full aspect-video">
          <iframe 
            src={mapUrl} 
            className="w-full h-full border-0 rounded-lg"
            title={`DynMap de ${instance.name}`}
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </Layout>
  )
}
