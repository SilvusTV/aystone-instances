import React from 'react'
import { Link, usePage } from '@inertiajs/react'

interface InstanceNavProps {
  instanceName: string
  className?: string
  items?: Array<{ label: string; href: string; match?: (url: string) => boolean }>
}

function defaultItems(instanceName: string): InstanceNavProps['items'] {
  const base = `/instances/${instanceName}`
  return [
    {
      label: 'Aperçu',
      href: `${base}`,
      match: (url) => url === `${base}` || url.startsWith(`${base}/description`),
    },
    {
      label: 'Projets',
      href: `${base}/projects`,
      match: (url) => url.startsWith(`${base}/projects`),
    },
    {
      label: 'Membres',
      href: `${base}/members`,
      match: (url) => url.startsWith(`${base}/members`),
    },
    {
      label: 'DynMap',
      href: `${base}/dynmap`,
      match: (url) => url.startsWith(`${base}/dynmap`),
    },
    {
      label: 'Service',
      href: `${base}/service`,
      match: (url) => url.startsWith(`${base}/service`),
    },
  ]
}

export default function InstanceNav({ instanceName, className = '', items }: InstanceNavProps) {
  const { url } = usePage()

  const navItems = items ?? defaultItems(instanceName)

  return (
    <div className={`bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6 ${className}`}>
      <nav className="flex flex-wrap gap-2 sm:gap-4">
        {navItems.map((item) => {
          const isActive = item.match ? item.match(url) : url === item.href
          const baseClasses =
            'px-3 py-2 sm:px-4 text-sm sm:text-base rounded transition flex-grow sm:flex-grow-0 text-center'
          const activeClasses = 'bg-primary-500 text-white hover:bg-primary-600'
          const inactiveClasses =
            'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'

          return (
            <Link key={item.href} href={item.href} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
