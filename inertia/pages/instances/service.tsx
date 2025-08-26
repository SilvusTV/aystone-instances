import React from 'react'
import { Head, Link } from '@inertiajs/react'
import Layout from '@/components/layout'
import InstanceNav from '@/components/InstanceNav'
import { Instance, InstanceService, PageProps } from '@/types'

interface ServicePageProps extends PageProps {
  instance: Instance & { service?: InstanceService | null }
  canEdit: boolean
}

function formatPrice(priceCents: number): string {
  if (!priceCents || priceCents === 0) return 'Gratuit'
  const euros = (priceCents / 100).toFixed(2)
  return `${euros.replace('.', ',')} Unitées`
}

export default function InstanceServicePage({ instance, canEdit }: ServicePageProps) {
  const service = instance.service || null

  return (
    <Layout>
      <Head title={`Service - ${instance.name}`} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Service de l'instance: {instance.name}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          <Link href={`/instances/${instance.name}`} className="text-primary-600 hover:text-primary-800 dark:text-primary-400">
            &larr; Retour à l'aperçu
          </Link>
        </div>
      </div>

      <InstanceNav instanceName={instance.name} />

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        {service ? (
          <div>
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-1">{service.title}</h2>
                <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">{formatPrice(service.priceCents)}</p>
              </div>
              {canEdit && (
                <Link
                  href={`/instances/${instance.name}/service/edit`}
                  className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded transition self-start"
                >
                  Modifier le service
                </Link>
              )}
            </div>
            <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: service.description }} />
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">Aucun service défini pour cette instance.</p>
            {canEdit && (
              <Link
                href={`/instances/${instance.name}/service/edit`}
                className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded transition"
              >
                Créer le service
              </Link>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}
