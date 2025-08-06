import React, { useState } from 'react'
import { Head, useForm } from '@inertiajs/react'
import Layout from '@/components/layout'
import { PageProps } from '@/types'

export default function Login({ flash }: PageProps) {
  const [showPassword, setShowPassword] = useState(false)
  const { data, setData, post, processing, errors } = useForm({
    uid: '',
    password: '',
    remember: false,
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

            <div className="mb-4">
              <label htmlFor="password" className="block mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="mb-6 flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                checked={data.remember}
                onChange={(e) => setData('remember', e.target.checked)}
              />
              <label htmlFor="remember" className="text-sm text-gray-700 dark:text-gray-300">
                Se souvenir de moi
              </label>
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
