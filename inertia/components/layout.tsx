import React, { useState } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { PageProps } from '@/types'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { auth = { user: null } } = usePage<PageProps>().props
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <header className="bg-primary-500 text-white shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold">Aystone2-Dirt</Link>
            </div>

            <nav className="flex items-center space-x-6">
              <Link href="/" className="hover:text-primary-200 transition">Accueil</Link>
              <Link href="/about" className="hover:text-primary-200 transition">À propos</Link>
              <Link href="/map" className="hover:text-primary-200 transition">Map dynamique</Link>

              {auth.user ? (
                <div className="flex items-center space-x-4">
                  <Link href="/dashboard" className="hover:text-primary-200 transition">Mon profil</Link>
                  <div className="flex items-center space-x-2">
                    <img 
                      src={`https://mineskin.eu/helm/${auth.user.username}`} 
                      alt={auth.user.username} 
                      className="w-8 h-8 rounded"
                    />
                    <span>{auth.user.username}</span>
                  </div>
                  <Link 
                    href="/logout" 
                    method="post" 
                    as="button" 
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white transition"
                  >
                    Déconnexion
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link 
                    href="/login" 
                    className="bg-primary-600 hover:bg-primary-700 px-3 py-1 rounded text-white transition"
                  >
                    Connexion
                  </Link>
                  <Link 
                    href="/register" 
                    className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-white transition"
                  >
                    Inscription
                  </Link>
                </div>
              )}

              <button 
                onClick={toggleDarkMode} 
                className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </nav>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="bg-gray-100 dark:bg-gray-800 py-6">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; {new Date().getFullYear()} Aystone2-Dirt. Tous droits réservés.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
