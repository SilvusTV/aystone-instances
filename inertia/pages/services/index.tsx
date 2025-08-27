import React from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import Layout from '@/components/layout'
import { PageProps, User, UserService } from '@/types'

interface ServicesIndexProps extends PageProps {
  services: (UserService & { user?: User })[]
}

function formatPrice(priceCents: number): string {
  if (!priceCents || priceCents === 0) return 'Gratuit'
  const euros = (priceCents / 100).toFixed(2)
  return `${euros.replace('.', ',')} Unitées`
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('fr-FR')
  } catch {
    return iso
  }
}

export default function ServicesIndexPage({ services, auth }: ServicesIndexProps) {
  const canCreate = !!auth?.user && ['joueur', 'instanceAdmin', 'admin'].includes(auth.user.role)

  return (
    <Layout>
      <Head title="Services" />

      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Services</h1>
          <p className="text-gray-600 dark:text-gray-400">Découvrez les services proposés par les joueurs.</p>
        </div>
        {canCreate && (
          <Link
            href="/services/create"
            className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded transition"
          >
            Proposer un service
          </Link>
        )}
      </div>

      {services.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">Aucun service pour le moment.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => {
            const owner = s.user
            const canEdit = !!auth?.user && (auth.user.id === s.userId || auth.user.role === 'admin')
            return (
              <div key={s.id} className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md flex flex-col">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">
                    <Link href={`/services/${s.id}`} className="hover:underline">
                      {s.title}
                    </Link>
                  </h3>
                  <div className="text-primary-600 dark:text-primary-400 font-semibold mb-2">
                    {formatPrice(s.priceCents)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <div>Créé le: {formatDate(s.createdAt)}</div>
                    <div>Proposé par: {owner?.username ?? 'Inconnu'}</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <Link
                    href={`/services/${s.id}`}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  >
                    Voir
                  </Link>
                  {canEdit && (
                    <>
                      <Link
                        href={`/services/${s.id}/edit`}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        Modifier
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm('Supprimer ce service ?')) {
                            router.delete(`/services/${s.id}`)
                          }
                        }}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                      >
                        Supprimer
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Layout>
  )
}
