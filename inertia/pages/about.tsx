import { Head } from '@inertiajs/react'
import Layout from '@/components/layout'

export default function About() {
  return (
    <Layout>
      <Head title="À propos" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">À propos des instances d'Aystone2</h1>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">À quoi sert ce site ?</h2>
          <p className="mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed">
            Ce site communautaire a été créé pour permettre aux joueurs des différentes instances de partager
            et de documenter leurs projets de construction.
          </p>
          <p className="mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed">
            En tant que visiteur, vous pouvez parcourir tous les projets en cours et terminés, filtrer par dimension,
            par type de projet ou par instance, et découvrir les créations impressionnantes de notre communauté.
          </p>
          <p className="mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed">
            En tant que joueur inscrit, vous pouvez créer et gérer vos propres projets, en fournissant des détails
            comme les coordonnées, la dimension, et même un lien vers la dynmap pour que d'autres puissent facilement
            trouver et visiter vos constructions.
          </p>
          <p className="text-sm sm:text-base leading-relaxed">
            Ce site est inspiré du <a href="https://cobble.ultralion.xyz/" className="hover:text-primary-200 underline transition px-1"> siteweb de l'instance cobble</a> créé par le développeur et joueur <a
            href="https://ultralion.xyz/" className="hover:text-primary-200 underline transition px-1"> UltraLion</a>
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Comment s'inscrire et rejoindre l'instance ?</h2>
          <div className="mb-5 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-medium mb-2">Étape 1: Créer un compte sur le site</h3>
            <p className="text-sm sm:text-base leading-relaxed">
              Commencez par vous inscrire sur ce site en utilisant votre pseudo Minecraft. Votre email est necessaire en cas de perte de votre mot de passe. Il ne sera pas utilisé à d'autres fins.
            </p>
          </div>

          <div className="mb-5 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-medium mb-2">Étape 2: Validation de votre compte</h3>
            <p className="text-sm sm:text-base leading-relaxed">
              Quand vous vous inscrivez, pinguez moi (@Silvus_tv) sur Discord, depuis le channel textuel de votre instance pour que je puisse valider votre compte.
              Si cette action n'est pas faite, vous resterez spectateur.
            </p>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-medium mb-2">Étape 3: Profitez</h3>
            <p className="mb-2 text-sm sm:text-base leading-relaxed">
              Une fois votre compte validé, entrez vos projets, parcourez ceux des autres joueurs, et participez à la vie de la communauté !
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
