import React, { useState } from 'react'
import { Head, Link } from '@inertiajs/react'
import Layout from '@/components/layout'
import { Project, PageProps } from '@/types'

interface ProfileProps extends PageProps {
  projects: Project[]
  email: string | null
}

export default function Profile({ auth = { user: null }, projects = [], email = null, flash }: ProfileProps) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  return (
    <Layout>
      <Head title="Profil" />

      <div className="mb-8">
        <div>
          <h1 className="text-3xl font-bold">Profil</h1>
          {auth.user ? (
            <p className="text-gray-600 dark:text-gray-400">
              Bienvenue, {auth.user.username} !
              {auth.user.role === 'invité' && (
                <span className="ml-2 text-yellow-600 dark:text-yellow-400">
                  (Votre compte est en attente de validation)
                </span>
              )}
            </p>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              Vous n'êtes pas connecté. Vous pouvez supprimer votre compte si nécessaire.
            </p>
          )}
        </div>
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

      {/* Account Management Section */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Gestion du compte</h2>

        {/* Email Update Form */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-2">Modifier votre email</h3>
          <form action="/profile/email" method="post" className="max-w-md">
            <input type="hidden" name="_csrf" value="" />
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={email || ''}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
            >
              Mettre à jour l'email
            </button>
          </form>
        </div>

        {/* Password Update Form */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-2">Modifier votre mot de passe</h3>
          <form action="/profile/password" method="post" className="max-w-md">
            <input type="hidden" name="_csrf" value="" />
            <div className="mb-4">
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mot de passe actuel
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirmer le nouveau mot de passe
              </label>
              <input
                type="password"
                id="passwordConfirmation"
                name="passwordConfirmation"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
            >
              Mettre à jour le mot de passe
            </button>
          </form>
        </div>

        {/* Account Deletion */}
        <div>
          <h3 className="text-lg font-medium mb-2">Supprimer votre compte</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Attention : cette action est irréversible. Toutes vos données seront définitivement supprimées.
          </p>
          {!showDeleteConfirmation ? (
            <button
              onClick={() => setShowDeleteConfirmation(true)}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition"
            >
              Supprimer mon compte
            </button>
          ) : (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="font-medium text-red-800 dark:text-red-200 mb-4">
                Êtes-vous vraiment sûr de vouloir supprimer votre compte ?
              </p>
              <div className="flex space-x-4">
                <Link
                  href="/profile/delete"
                  method="delete"
                  as="button"
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition"
                >
                  Oui, supprimer définitivement
                </Link>
                <button
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </Layout>
  )
}
