import { useState } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import Layout from '@/components/layout'
import { User, Instance, PageProps } from '@/types'

interface AdminUsersProps extends PageProps {
  users: User[]
  instances: Instance[]
}

export default function AdminUsers({ users = [], instances = [], flash }: AdminUsersProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [currentUser, setCurrentUser] = useState<User | null>(null)


  const { processing } = useForm()

  const openResetModal = (user: User) => {
    setSelectedUser(user)
    setNewPassword('')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  const handleInstanceChange = (user: User, instanceId: string) => {
    setCurrentUser(user)

    const instanceName = instanceId 
      ? instances.find(i => i.id.toString() === instanceId)?.name || 'Aucune'
      : 'Aucune';

    if (confirm(`Êtes-vous sûr de vouloir changer l'instance de ${user.username} en ${instanceName} ?`)) {
      const formData = new FormData();
      formData.append('instanceId', instanceId);

      fetch(`/admin/users/${user.id}/instance`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-XSRF-TOKEN': document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'))?.[2] || '',
        },
      })
      .then(response => {
        if (response.ok) {
          window.location.reload();
        } else {
          // Show an alert for user feedback
          alert(`Erreur lors de la mise à jour de l'instance: ${response.status} ${response.statusText}`);
        }
      })
      .catch(() => {
        // Show a generic error message
        alert(`Une erreur est survenue lors de la mise à jour de l'instance.`);
      });
    }
  }

  const handleRoleChange = (user: User, role: string) => {
    setCurrentUser(user)

    if (confirm(`Êtes-vous sûr de vouloir changer le rôle de ${user.username} en ${role} ?`)) {
      const formData = new FormData();
      formData.append('role', role);

      fetch(`/admin/users/${user.id}/role`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-XSRF-TOKEN': document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'))?.[2] || '',
        },
      })
      .then(response => {
        if (response.ok) {
          window.location.reload();
        } else {
          // Show an alert for user feedback
          alert(`Erreur lors de la mise à jour du rôle: ${response.status} ${response.statusText}`);
        }
      })
      .catch(() => {
        // Show a generic error message
        alert(`Une erreur est survenue lors de la mise à jour du rôle.`);
      });
    }
  }

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
                <th className="px-4 py-2 text-left">Instance</th>
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
                    {user.instance ? (
                      <Link
                        href={`/instances/${user.instance.id}`}
                        className="text-primary-600 hover:text-primary-800 dark:text-primary-400"
                      >
                        {user.instance.name}
                      </Link>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-sm ${
                      user.role === 'admin' 
                        ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200' 
                        : user.role === 'instanceAdmin' || user.role === 'admin'
                        ? 'bg-purple-200 text-purple-800 dark:bg-purple-800 dark:text-purple-200'
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
                      <select
                        className="mr-2 p-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                        defaultValue={user.role}
                        onChange={(e) => handleRoleChange(user, e.target.value)}
                        disabled={processing && currentUser?.id === user.id}
                      >
                        <option value="invité">Invité</option>
                        <option value="joueur">Joueur</option>
                        <option value="instanceAdmin">Admin d'instance</option>
                        <option value="admin">Admin</option>
                      </select>

                      <select
                        className="mr-2 p-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                        defaultValue={user.instanceId || ''}
                        onChange={(e) => handleInstanceChange(user, e.target.value)}
                        disabled={processing && currentUser?.id === user.id}
                      >
                        <option value="">Aucune / Visiteur</option>
                        {instances.map((instance) => (
                          <option key={instance.id} value={instance.id}>
                            {instance.name} (ID: {instance.id})
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition mr-2"
                        onClick={() => openResetModal(user)}
                      >
                        Réinitialiser MDP
                      </button>

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

      {/* Password Reset Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Réinitialiser le mot de passe</h2>
            <p className="mb-4">
              Vous êtes sur le point de réinitialiser le mot de passe de <strong>{selectedUser.username}</strong>.
            </p>

            <form action={`/admin/users/${selectedUser.id}/reset-password`} method="post">
              <div className="mb-4">
                <label htmlFor="password" className="block mb-2">Nouveau mot de passe</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  minLength={6}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">Le mot de passe doit contenir au moins 6 caractères.</p>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                >
                  Réinitialiser
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}
