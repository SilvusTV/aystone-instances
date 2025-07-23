# Aystone2-Dirt

Site communautaire pour les joueurs de l'instance "dirt" du serveur Minecraft Aystone.

## Description

Ce site permet aux joueurs de l'instance Aystone2-Dirt de partager et documenter leurs projets de construction. Les visiteurs peuvent parcourir les projets en cours et terminés, tandis que les joueurs authentifiés peuvent créer et gérer leurs propres projets.

## Fonctionnalités

- Authentification des utilisateurs (inscription, connexion)
- Gestion des rôles (invité, joueur, admin)
- Création et gestion de projets
- Filtrage des projets par statut, dimension et type
- Interface d'administration pour la gestion des utilisateurs
- Mode clair/sombre

## Prérequis

- Docker et Docker Compose

## Installation et démarrage

1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/aystone2-dirt.git
   cd aystone2-dirt
   ```

2. Créez un fichier `.env` à partir du modèle `.env.example` :
   ```bash
   cp .env.example .env
   ```

3. Modifiez le fichier `.env` pour configurer votre environnement, notamment en générant une nouvelle clé d'application :
   ```
   APP_KEY=générez_une_clé_aléatoire_ici
   ```

4. Démarrez les conteneurs avec Docker Compose :
   ```bash
   docker-compose up -d
   ```

5. Accédez à l'application dans votre navigateur :
   ```
   http://localhost:3333
   ```

## Développement

### Structure du projet

- `app/` - Contrôleurs, modèles et middleware
- `database/` - Migrations et seeders
- `inertia/` - Composants React pour le front-end
- `start/` - Configuration de l'application (routes, kernel, etc.)

### Commandes utiles

- Démarrer les conteneurs : `docker-compose up -d`
- Arrêter les conteneurs : `docker-compose down`
- Voir les logs : `docker-compose logs -f app`
- Exécuter les migrations : `docker-compose exec app node ace migration:run`
- Accéder au shell du conteneur : `docker-compose exec app sh`

## Technologies utilisées

- **Backend** : AdonisJS (Node.js)
- **Frontend** : React avec InertiaJS
- **Base de données** : PostgreSQL
- **Styles** : Tailwind CSS
- **Conteneurisation** : Docker et Docker Compose

## Licence

Ce projet est sous licence MIT.