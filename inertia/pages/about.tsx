import { Head } from '@inertiajs/react'
import Layout from '@/components/layout'

export default function About() {
  return (
    <Layout>
      <Head title="À propos" />
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">À propos des instances d'Aystone2</h1>
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">À quoi sert ce site ?</h2>
          <p className="mb-4">
            Ce site communautaire a été créé pour permettre aux joueurs de l'instance Dirt de partager
            et de documenter leurs projets de construction.
          </p>
          <p className="mb-4">
            En tant que visiteur, vous pouvez parcourir tous les projets en cours et terminés, filtrer par dimension,
            par type de projet ou par instance, et découvrir les créations impressionnantes de notre communauté.
          </p>
          <p>
            En tant que joueur inscrit, vous pouvez créer et gérer vos propres projets, en fournissant des détails
            comme les coordonnées, la dimension, et même un lien vers la dynmap pour que d'autres puissent facilement
            trouver et visiter vos constructions.
          </p>
          <p>Ce site est inspiré du <a href="https://cobble.ultralion.xyz/"> siteweb de l'instance cobble</a> créé par le développeur et joueur <a
            href="https://ultralion.xyz/"> UltraLion</a></p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Comment s'inscrire et rejoindre l'instance ?</h2>
          <div className="mb-6">
            <h3 className="text-xl font-medium mb-2">Étape 1: Créer un compte sur le site</h3>
            <p>
              Commencez par vous inscrire sur ce site en utilisant votre pseudo Minecraft. Votre email est necessaire en cas de perte de votre mot de passe. Il ne sera pas utilisé à d'autres fins.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-medium mb-2">Étape 2: Validation de votre compte</h3>
            <p>
              Quand vous vous inscrivez, pinguez moi (@Silvus_tv) sur Discord, depuis le channel textuel de votre instance pour que je puisse valider votre compte.
              Si cette action n'est pas faite, vous resterez spectateur.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-2">Étape 3: Profitez</h3>
            <p className="mb-2">
              Une fois votre compte validé, entrez vos projets, parcourez ceux des autres joueurs, et participez à la vie de la communauté !
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}