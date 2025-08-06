import { Head } from '@inertiajs/react'
import Layout from '@/components/layout'

export default function UtilsPage() {
  return (
    <Layout>
      <Head title="Liens utiles" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Liens utiles</h1>
        <p className="text-lg">
          Retrouvez ici une collection de liens et ressources utiles pour votre expérience sur Aystone2.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Official Resources */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-t-4 border-blue-500">
          <h2 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">Ressources officielles</h2>
          <ul className="space-y-3">
            <li>
              <a 
                href="https://wiki.aystone.fr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Wiki Aystone
              </a>
            </li>
            <li>
              <a 
                href="https://discord.gg/aypierre"
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Discord Aypierre
              </a>
            </li>
            <li>
              <a 
                href="https://aystone.fr"
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Site web
              </a>
            </li>
          </ul>
        </div>

        {/* Mods & Resource Packs */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-t-4 border-green-500">
          <h2 className="text-xl font-bold mb-4 text-green-600 dark:text-green-400">Mods & Resource Packs</h2>
          <ul className="space-y-3">
            <li>
              <a 
                href="https://www.curseforge.com/minecraft/mc-mods/sodium" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Sodium (Performances)
              </a>
            </li>
            <li>
              <a 
                href="https://www.curseforge.com/minecraft/mc-mods/litematica" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Litematica (Schématiques)
              </a>
            </li>
            <li>
              <a 
                href="https://discord.com/channels/264154411939397632/1395490420330463454/1396068626104188980"
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Aystone ModPack (Modpack communautaire pour aystone)
              </a>
            </li>
          </ul>
        </div>

        {/* Map Making Tools */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-t-4 border-purple-500">
          <h2 className="text-xl font-bold mb-4 text-purple-600 dark:text-purple-400">Outils de cartographie</h2>
          <ul className="space-y-3">
            <li>
              <a 
                href="https:/maps.aystone.fr/"
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                BlueMaps (Maps interactives des instances)
              </a>
            </li>
            <li>
              <a 
                href="https://www.plotz.co.uk/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                Plotz (Générateur de formes)
              </a>
            </li>
            <li>
              <a 
                href="https://rebane2001.com/mapartcraft/"
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                MapArtCraft (Création de pixel art)
              </a>
            </li>
          </ul>
        </div>

        {/* Tutorials */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-t-4 border-yellow-500">
          <h2 className="text-xl font-bold mb-4 text-yellow-600 dark:text-yellow-400">Tutoriels</h2>
          <ul className="space-y-3">
            <li>
              <a 
                href="https://discord.com/channels/264154411939397632/1398832982986461276"
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Faites moi des suggestions sur Discord
              </a>
            </li>
          </ul>
        </div>

        {/* Community Resources */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-t-4 border-red-500">
          <h2 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">Ressources communautaires</h2>
          <ul className="space-y-3">
            <li>
              <a 
                href="https://www.planetminecraft.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Planet Minecraft
              </a>
            </li>
            <li>
              <a 
                href="https://www.reddit.com/r/Minecraft/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Reddit Minecraft
              </a>
            </li>
            <li>
              <a 
                href="https://minecraft.fandom.com/wiki/Minecraft_Wiki" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Minecraft Wiki
              </a>
            </li>
          </ul>
        </div>

      </div>
    </Layout>
  )
}