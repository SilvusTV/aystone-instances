import React from 'react'
import { Head, useForm } from '@inertiajs/react'
import Layout from '@/components/layout'
import { PageProps } from '@/types'

export default function ForgotPassword({ flash }: PageProps) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/forgot-password')
  }

  return (
    <Layout>
      <Head title="Mot de passe oublié" />
      
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Mot de passe oublié</h1>
        
        {flash?.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {flash.error}
          </div>
        )}
        
        {flash?.success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {flash.success}
          </div>
        )}
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <p className="mb-4">
            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2">
                Email
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
            </div>
            
            <div>
              <button
                type="submit"
                disabled={processing}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded transition"
              >
                {processing ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
              </button>
            </div>
          </form>
          
          <div className="mt-4 text-center">
            <p>
              <a href="/login" className="text-primary-600 hover:text-primary-800 dark:text-primary-400">
                Retour à la connexion
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}