import React from 'react'
import { Head, useForm } from '@inertiajs/react'
import Layout from '@/components/layout'
import { PageProps, Instance } from '@/types'

interface RegisterProps extends PageProps {
  instances: Instance[]
}

export default function Register({ flash, instances = [] }: RegisterProps) {
  const { data, setData, post, processing, errors } = useForm({
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    instance_id: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/register')
  }

  return (
    <Layout>
      <Head title="Inscription" />

      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Inscription</h1>

        {flash?.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {flash.error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block mb-2">
                Pseudo Minecraft <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                type="text"
                className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 ${
                  errors.username ? 'border-red-500' : ''
                }`}
                value={data.username}
                onChange={(e) => setData('username', e.target.value)}
                required
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                Votre pseudo Minecraft exact, sensible à la casse.
              </p>
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block mb-2">
                Email <span className="text-gray-500">(facultatif)</span>
              </label>
              <input
                id="email"
                type="email"
                className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 ${
                  errors.email ? 'border-red-500' : ''
                }`}
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                Recommandé pour récupérer votre compte en cas d'oubli du mot de passe.
              </p>
            </div>

            <div className="mb-4">
              <label htmlFor="instance_id" className="block mb-2">
                Instance <span className="text-gray-500">(facultatif)</span>
              </label>
              <select
                id="instance_id"
                className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 ${
                  errors.instance_id ? 'border-red-500' : ''
                }`}
                value={data.instance_id}
                onChange={(e) => setData('instance_id', e.target.value)}
              >
                <option value="">Aucune / Visiteur</option>
                {instances.map((instance) => (
                  <option key={instance.id} value={instance.id}>
                    {instance.name} (ID: {instance.id})
                  </option>
                ))}
              </select>
              {errors.instance_id && (
                <p className="text-red-500 text-sm mt-1">{errors.instance_id}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                Sélectionnez l'instance Minecraft à laquelle vous appartenez.
              </p>
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block mb-2">
                Mot de passe <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                type="password"
                className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 ${
                  errors.password ? 'border-red-500' : ''
                }`}
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                required
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="password_confirmation" className="block mb-2">
                Confirmer le mot de passe <span className="text-red-500">*</span>
              </label>
              <input
                id="password_confirmation"
                type="password"
                className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 ${
                  errors.password_confirmation ? 'border-red-500' : ''
                }`}
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                required
              />
              {errors.password_confirmation && (
                <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>
              )}
            </div>

            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                En vous inscrivant, votre compte sera créé avec le statut "invité". Un administrateur
                devra valider votre compte pour que vous puissiez accéder à toutes les fonctionnalités
                du site. Consultez la page <a href="/about" className="text-primary-600 hover:text-primary-800 dark:text-primary-400">À propos</a> pour
                plus d'informations.
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={processing}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded transition"
              >
                {processing ? 'Inscription en cours...' : 'S\'inscrire'}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p>
              Déjà inscrit ?{' '}
              <a href="/login" className="text-primary-600 hover:text-primary-800 dark:text-primary-400">
                Se connecter
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
