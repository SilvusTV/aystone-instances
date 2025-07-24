import React from 'react'
import { Head, useForm } from '@inertiajs/react'
import Layout from '@/components/layout'
import { PageProps } from '@/types'

export default function Login({ flash }: PageProps) {
  const { data, setData, post, processing, errors } = useForm({
    uid: '',
    password: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/login')
  }

  return (
    <Layout>
      <Head title="Connexion" />

      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Connexion</h1>

        {flash?.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {flash.error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="uid" className="block mb-2">
                Pseudo Minecraft ou Email
              </label>
              <input
                id="uid"
                type="text"
                className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 ${
                  errors.uid ? 'border-red-500' : ''
                }`}
                value={data.uid}
                onChange={(e) => setData('uid', e.target.value)}
              />
              {errors.uid && (
                <p className="text-red-500 text-sm mt-1">{errors.uid}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 ${
                  errors.password ? 'border-red-500' : ''
                }`}
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={processing}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded transition"
              >
                {processing ? 'Connexion en cours...' : 'Se connecter'}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p>
              Pas encore de compte ?{' '}
              <a href="/register" className="text-primary-600 hover:text-primary-800 dark:text-primary-400">
                S'inscrire
              </a>
            </p>
            <p className="mt-2">
              <a href="/forgot-password" className="text-primary-600 hover:text-primary-800 dark:text-primary-400">
                Mot de passe oublié ?
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
