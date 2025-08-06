import React, { useState, useEffect } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { PageProps } from '@/types'
import ToastContainer from './ToastContainer'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { auth = { user: null } } = usePage<PageProps>().props
  const [darkMode, setDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isAdmin = auth.user?.role === 'admin'

  // Function to get CSRF token from cookie
  const getCsrfToken = () => {
    const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'))
    if (match) {
      return decodeURIComponent(match[2])
    }
    // Fallback to look for the token in other possible cookie names
    const altMatch = document.cookie.match(new RegExp('(^| )adonis-session=([^;]+)'))
    return altMatch ? decodeURIComponent(altMatch[2]) : null
  }

  // Function to handle CSRF token errors
  const handleCsrfError = (response) => {
    if (response.status === 419 || 
        (response.status === 500 && response.statusText.includes('CSRF'))) {
      // Refresh the page to get a new CSRF token
      window.location.reload()
      return true
    }
    return false
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
        .then((response) => {
          if (handleCsrfError(response)) {
            return null
          }
          return response.json()
        })
        .then((data) => {
          if (!data) return
          const isDarkMode = data.value === 'true'
          setDarkMode(isDarkMode)
          if (isDarkMode) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        })
        .catch(() => {
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen) {
        const dropdown = document.getElementById('user-dropdown')
        const dropdownButton = document.getElementById('user-dropdown-button')
        if (
          dropdown && 
          dropdownButton && 
          !dropdown.contains(event.target) && 
          !dropdownButton.contains(event.target)
        ) {
          setIsDropdownOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

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
      })
      .then(response => {
        if (handleCsrfError(response)) {
          return null
        }
        return response
      })
      .catch(() => {
        // Silently fail - the preference will still be applied to the current session
        // but won't be persisted for future sessions
      })
    } else {
      // If user is not logged in, save to localStorage
      localStorage.setItem('darkMode', newDarkMode.toString())
    }
  }

  return (
    <div className={`${darkMode ? 'dark' : ''} overflow-x-hidden`}>
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <header className="text-white shadow-md" style={{ background: "linear-gradient(90deg,rgba(190, 77, 196, 1) 0%, rgba(147, 87, 199, 1) 50%, rgba(84, 22, 219, 1) 100%)" }}>
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold">
                Aystone2 : Instances
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={toggleDarkMode}
                className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full mr-4"
                aria-label="Toggle dark mode"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white focus:outline-none"
                aria-label="Toggle mobile menu"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="hover:text-primary-200 transition">
                Accueil
              </Link>
              <Link href="/instances" className="hover:text-primary-200 transition">
                Instances
              </Link>
              <Link href="/utils" className="hover:text-primary-200 transition">
                Liens utiles
              </Link>
              <Link href="/about" className="hover:text-primary-200 transition">
                À propos
              </Link>

              {auth.user ? (
                <div className="flex items-center space-x-4">
                  {['joueur', 'instanceAdmin', 'admin'].includes(auth.user.role) && (
                  <Link href="/dashboard" className="hover:text-primary-200 transition">
                    Mes projets
                  </Link>
                  )}
                  {['admin'].includes(auth.user.role) && (
                  <Link href="/dashboard/s3" className="hover:text-primary-200 transition">
                    Gestionnaire S3
                  </Link>
                  )}
                  <div className="relative">
                    <div 
                      id="user-dropdown-button"
                      className="flex items-center space-x-2 cursor-pointer hover:text-primary-200 transition"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <img
                        src={`https://mineskin.eu/helm/${auth.user.username}`}
                        alt={auth.user.username}
                        className="w-8 h-8 rounded"
                      />
                      <span>{auth.user.username}</span>
                      <svg 
                        className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>

                    {isDropdownOpen && (
                      <div id="user-dropdown" className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                        {isAdmin && (
                          <Link 
                            href={`/admin/users`}
                            className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            Gestion des membres
                          </Link>
                        )}
                        <Link 
                          href="/profile" 
                          className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Mon profil
                        </Link>
                        <Link
                          href="/logout"
                          method="post"
                          as="button"
                          className="block w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Déconnexion
                        </Link>
                      </div>
                    )}
                  </div>
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
                aria-label="Toggle dark mode"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </nav>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-primary-800 text-white">
              <div className="container mx-auto px-4 py-3 space-y-3">
                <Link 
                  href="/" 
                  className="block py-2 hover:text-primary-200 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Accueil
                </Link>
                <Link 
                  href="/instances" 
                  className="block py-2 hover:text-primary-200 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Instances
                </Link>
                <Link 
                  href="/utils" 
                  className="block py-2 hover:text-primary-200 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Liens utiles
                </Link>
                <Link 
                  href="/about" 
                  className="block py-2 hover:text-primary-200 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  À propos
                </Link>

                {auth.user ? (
                  <div className="border-t border-primary-700 pt-3 space-y-3">
                    {['joueur', 'instanceAdmin', 'admin'].includes(auth.user.role) && (
                      <Link 
                        href="/dashboard" 
                        className="block py-2 hover:text-primary-200 transition"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Mes projets
                      </Link>
                    )}
                    {['admin'].includes(auth.user.role) && (
                      <Link 
                        href="/dashboard/s3" 
                        className="block py-2 hover:text-primary-200 transition"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Gestionnaire S3
                      </Link>
                    )}
                    {isAdmin && (
                      <Link 
                        href={`/admin/users`}
                        className="block py-2 hover:text-primary-200 transition"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Gestion des membres
                      </Link>
                    )}
                    <Link 
                      href="/profile" 
                      className="block py-2 hover:text-primary-200 transition"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Mon profil
                    </Link>
                    <Link
                      href="/logout"
                      method="post"
                      as="button"
                      className="block w-full text-left py-2 text-red-400 hover:text-red-300 transition"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Déconnexion
                    </Link>
                  </div>
                ) : (
                  <div className="border-t border-primary-700 pt-3 flex flex-col space-y-3">
                    <Link
                      href="/login"
                      className="block py-2 hover:text-primary-200 transition"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Connexion
                    </Link>
                    <Link
                      href="/register"
                      className="block py-2 hover:text-primary-200 transition"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Inscription
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </header>

        <main className="flex-1 container mx-auto px-4 py-8">{children}</main>

        <footer className="bg-gray-100 dark:bg-gray-800 py-6">
          <div className="container mx-auto px-4 text-center">
            <p>
              &copy; {new Date().getFullYear()} Instances Aystone2 — Projet non affilié à
              Mojang/Microsoft
            </p>
            <p>Projet communautaire. N'est pas un produit officiel de Aystone ni de Aypierre</p>
            <p>Fait avec ❤️(Kaka) par Silvus_TV</p>
          </div>
        </footer>
        
        {/* Toast Container for notifications */}
        <ToastContainer />
      </div>
    </div>
  )
}
