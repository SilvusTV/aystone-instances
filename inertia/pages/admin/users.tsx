import React from 'react'
import { Head, Link } from '@inertiajs/react'
import Layout from '@/components/layout'
import { User, PageProps } from '@/types'

interface AdminUsersProps extends PageProps {
  users: User[]
}

export default function AdminUsers({ users = [], flash }: AdminUsersProps) {
  return (
    <Layout>
      <Head title="Gestion des utilisateurs" />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gestion des utilisateurs</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gérez les utilisateurs et leurs rôles sur la plateforme.
        </p>
      </div>
      
      {flash?.success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {flash.success}
        </div>
      )}
      
      {flash?.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {flash.error}
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Pseudo</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Rôle</th>
                <th className="px-4 py-2 text-left">Date d'inscription</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b dark:border-gray-700">
                  <td className="px-4 py-3">{user.id}</td>
                  <td className="px-4 py-3 flex items-center">
                    <img 
                      src={`https://mineskin.eu/helm/${user.username}`} 
                      alt={user.username} 
                      className="w-6 h-6 mr-2 rounded"
                    />
                    {user.username}
                  </td>
                  <td className="px-4 py-3">{user.email || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-sm ${
                      user.role === 'admin' 
                        ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200' 
                        : user.role === 'joueur'
                        ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
                        : 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <form action={`/admin/users/${user.id}/role`} method="post">
                        <select 
                          name="role"
                          className="mr-2 p-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                          defaultValue={user.role}
                          onChange={(e) => {
                            if (confirm(`Êtes-vous sûr de vouloir changer le rôle de ${user.username} en ${e.target.value} ?`)) {
                              e.target.form?.submit();
                            }
                          }}
                        >
                          <option value="invité">Invité</option>
                          <option value="joueur">Joueur</option>
                          <option value="admin">Admin</option>
                        </select>
                      </form>
                      
                      <Link
                        href={`/admin/users/${user.id}`}
                        method="delete"
                        as="button"
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
                        onClick={(e) => {
                          if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.username} ? Cette action est irréversible.`)) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Supprimer
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {users.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              Aucun utilisateur trouvé.
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-6">
        <Link
          href="/dashboard"
          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition"
        >
          Retour au tableau de bord
        </Link>
      </div>
    </Layout>
  )
}