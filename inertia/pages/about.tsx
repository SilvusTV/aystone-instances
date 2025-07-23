import React from 'react'
import { Head } from '@inertiajs/react'
import Layout from '@/components/layout'

export default function About() {
  return (
    <Layout>
      <Head title="À propos" />
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">À propos d'Aystone2-Dirt</h1>
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Présentation de l'instance Aystone2-Dirt</h2>
          <p className="mb-4">
            Aystone2-Dirt est une instance du serveur Minecraft Aystone dédiée aux projets de construction en mode survie.
            Cette instance met l'accent sur la collaboration et la créativité des joueurs dans un environnement convivial.
          </p>
          <p>
            Les joueurs peuvent explorer le monde, collecter des ressources et construire des projets impressionnants
            tout en interagissant avec la communauté.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">À quoi sert ce site ?</h2>
          <p className="mb-4">
            Ce site communautaire a été créé pour permettre aux joueurs de l'instance Aystone2-Dirt de partager
            et de documenter leurs projets de construction.
          </p>
          <p className="mb-4">
            En tant que visiteur, vous pouvez parcourir tous les projets en cours et terminés, filtrer par dimension
            ou par type de projet, et découvrir les créations impressionnantes de notre communauté.
          </p>
          <p>
            En tant que joueur inscrit, vous pouvez créer et gérer vos propres projets, en fournissant des détails
            comme les coordonnées, la dimension, et même un lien vers la dynmap pour que d'autres puissent facilement
            trouver et visiter vos constructions.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Comment s'inscrire et rejoindre l'instance ?</h2>
          <div className="mb-6">
            <h3 className="text-xl font-medium mb-2">Étape 1: Créer un compte sur le site</h3>
            <p>
              Commencez par vous inscrire sur ce site en utilisant votre pseudo Minecraft. Une fois inscrit,
              votre compte sera en attente de validation par un administrateur.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-medium mb-2">Étape 2: Rejoindre le Discord</h3>
            <p>
              Rejoignez notre serveur Discord pour faire partie de la communauté et rester informé des dernières
              actualités. C'est également sur Discord que vous pourrez demander la validation de votre compte.
            </p>
            <div className="mt-2">
              <a 
                href="https://discord.gg/aystone" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition"
              >
                Rejoindre le Discord
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-2">Étape 3: Se connecter au serveur Minecraft</h3>
            <p className="mb-2">
              Une fois votre compte validé, vous pourrez vous connecter au serveur Minecraft Aystone2-Dirt
              en utilisant l'adresse suivante:
            </p>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded font-mono text-center">
              mc.aystone.fr
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}