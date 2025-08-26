import React, { useState } from 'react'
import { Head, Link } from '@inertiajs/react'
import Layout from '@/components/layout'
import InstanceNav from '@/components/InstanceNav'
import { Instance, User } from '@/types'

interface InstanceMembersProps {
  instance: Instance
  members: User[]
}

export default function InstanceMembers({ instance, members = [] }: InstanceMembersProps) {
  const [searchTerm, setSearchTerm] = useState('')

  // Filter members based on search term
  const filteredMembers = members.filter(member => 
    member.username.toLowerCase().includes(searchTerm.toLowerCase())
  )
  return (
    <Layout>
      <Head title={`Membres - ${instance.name}`} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Membres de l'instance: {instance.name}</h1>
        <div className="flex space-x-2 mb-4">
          <Link href="/instances" className="text-primary-600 hover:text-primary-800 dark:text-primary-400">
            &larr; Retour aux instances
          </Link>
        </div>
      </div>

      <InstanceNav instanceName={instance.name} />

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Liste des membres</h2>
            <p className="text-sm text-gray-500">{members.length} {members.length === 1 ? 'membre' : 'membres'}</p>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher par pseudo MC"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
        </div>

        {members.length > 0 ? (
          <>
            {filteredMembers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.map(member => (
                  <div key={member.id} className="flex items-center p-4 border rounded-lg dark:border-gray-700">
                    <img
                      src={`https://mineskin.eu/helm/${member.username}`}
                      alt={member.username}
                      className="w-12 h-12 rounded mr-4"
                    />
                    <div>
                      <h3 className="font-bold text-lg">{member.username}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {member.role === 'admin' ? 'Administrateur' : member.role === 'joueur' ? 'Joueur' : 'Invité'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-xl text-gray-500 dark:text-gray-400">
                  Aucun membre ne correspond à votre recherche.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-xl text-gray-500 dark:text-gray-400">
              Aucun membre trouvé pour cette instance.
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}
