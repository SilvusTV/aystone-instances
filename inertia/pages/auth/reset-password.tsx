import React, { useEffect } from 'react'
import { Head, useForm } from '@inertiajs/react'
import Layout from '@/components/layout'
import { PageProps } from '@/types'

interface ResetPasswordProps extends PageProps {
  token: string
}

export default function ResetPassword({ flash, token }: ResetPasswordProps) {
  // Log for debugging
  useEffect(() => {
    console.log('Reset password page loaded with token:', token)
  }, [token])

  const { data, setData, post, processing, errors } = useForm({
    token,
    password: '',
    password_confirmation: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/reset-password')
  }

  return (
    <Layout>
      <Head title="Réinitialiser le mot de passe" />

      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Réinitialiser le mot de passe</h1>

        {flash?.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {flash.error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            <input type="hidden" name="token" value={token} />

            <div className="mb-4">
              <label htmlFor="password" className="block mb-2">
                Nouveau mot de passe
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

            <div className="mb-6">
              <label htmlFor="password_confirmation" className="block mb-2">
                Confirmer le mot de passe
              </label>
              <input
                id="password_confirmation"
                type="password"
                className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 ${
                  errors.password_confirmation ? 'border-red-500' : ''
                }`}
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
              />
              {errors.password_confirmation && (
                <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={processing}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded transition"
              >
                {processing ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
