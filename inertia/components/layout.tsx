import React, { useState, useEffect } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { PageProps } from '@/types'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { auth = { user: null } } = usePage<PageProps>().props
  const [darkMode, setDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Function to get CSRF token from cookie
  const getCsrfToken = () => {
    const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'))
    return match ? decodeURIComponent(match[2]) : null
  }

  // Load user's dark mode preference on component mount
  useEffect(() => {
    if (auth.user) {
      // If user is logged in, try to get their preference from the database
      fetch(`/api/config/darkMode`, {
        headers: {
          'X-XSRF-TOKEN': getCsrfToken() || '',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const isDarkMode = data.value === 'true'
          setDarkMode(isDarkMode)
          if (isDarkMode) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        })
        .catch((error) => {
          console.error('Error fetching dark mode preference:', error)
          // Default to light mode on error
          setDarkMode(false)
          document.documentElement.classList.remove('dark')
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      // If user is not logged in, use localStorage
      const savedMode = localStorage.getItem('darkMode')
      const isDarkMode = savedMode === 'true'
      setDarkMode(isDarkMode)
      if (isDarkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      setIsLoading(false)
    }
  }, [auth.user])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)

    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    if (auth.user) {
      // If user is logged in, save preference to database
      fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': getCsrfToken() || '',
        },
        body: JSON.stringify({
          key: 'darkMode',
          value: newDarkMode.toString(),
        }),
      }).catch((error) => {
        console.error('Error saving dark mode preference:', error)
      })
    } else {
      // If user is not logged in, save to localStorage
      localStorage.setItem('darkMode', newDarkMode.toString())
    }
  }

  return (
    <div className={`${darkMode ? 'dark' : ''} overflow-x-hidden`}>
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <header className="bg-primary-500 text-white shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold">
                Aystone2-Dirt
              </Link>
            </div>

            <nav className="flex items-center space-x-6">
              <Link href="/" className="hover:text-primary-200 transition">
                Accueil
              </Link>
              <Link href="/about" className="hover:text-primary-200 transition">
                À propos
              </Link>
              <a
                href="https://maps.aystone.fr/dirt/"
                target={'_blank'}
                className="hover:text-primary-200 transition"
              >
                Map dynamique
              </a>

              {auth.user ? (
                <div className="flex items-center space-x-4">
                  {['joueur', 'admin'].includes(auth.user.role) && (
                  <Link href="/dashboard" className="hover:text-primary-200 transition">
                    Mon profil
                  </Link>
                    )}
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

        <main className="flex-1 container mx-auto px-4 py-8">{children}</main>

        <footer className="bg-gray-100 dark:bg-gray-800 py-6">
          <div className="container mx-auto px-4 text-center">
            <p>
              &copy; {new Date().getFullYear()} Aystone2 instance Dirt — Projet non affilié à
              Mojang/Microsoft
            </p>
            <p>Fait avec ❤️(Kaka) par Silvus_TV</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
