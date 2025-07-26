# Aystone2-Dirt

Site communautaire pour les joueurs de l'instance "dirt" du serveur Minecraft Aystone.

## Description

Ce site permet aux joueurs des différentes instances d'Aystone2 de partager et documenter leurs projets de construction. Les visiteurs peuvent parcourir les projets en cours et terminés, tandis que les joueurs authentifiés peuvent créer et gérer leurs propres projets.

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

## Déploiement en production avec HTTPS

1. Assurez-vous que votre domaine (instances-aystone.silvus.me) pointe vers votre serveur.

2. Créez les répertoires nécessaires pour les certificats SSL :
   ```bash
   mkdir -p certs html vhost.d
   ```

3. Démarrez les conteneurs avec Docker Compose en utilisant le fichier de configuration de production :
   ```bash
   docker-compose -f compose-production.yml up -d
   ```

4. Le service Let's Encrypt obtiendra automatiquement un certificat SSL pour votre domaine et configurera HTTPS.

5. Accédez à l'application dans votre navigateur :
   ```
   https://instances-aystone.silvus.me
   ```

Note : Si vous rencontrez des problèmes avec HTTPS, vérifiez les logs des conteneurs :
   ```bash
   docker logs nginx-proxy
   docker logs nginx-letsencrypt
   ```

## Accès à la base de données à distance

Par défaut, la base de données PostgreSQL est configurée pour être accessible uniquement depuis le serveur lui-même (localhost) pour des raisons de sécurité. Pour permettre l'accès depuis votre adresse IP spécifique, utilisez les scripts fournis dans le dossier `scripts/`.

### Configurer l'accès pour votre adresse IP

#### Sous Linux/macOS :
```bash
# Remplacez 123.123.123.123 par votre adresse IP
./scripts/configure-db-access.sh 123.123.123.123
```

#### Sous Windows :
```powershell
# Remplacez 123.123.123.123 par votre adresse IP
.\scripts\Configure-DbAccess.ps1 -IpAddress 123.123.123.123
```

Après avoir exécuté le script, redémarrez les conteneurs pour appliquer les changements :
```bash
docker-compose -f compose-production.yml down
docker-compose -f compose-production.yml up -d
```

### Supprimer l'accès distant

Lorsque vous n'avez plus besoin d'accéder à la base de données à distance, il est recommandé de supprimer cet accès pour des raisons de sécurité.

#### Sous Linux/macOS :
```bash
./scripts/remove-db-access.sh
```

#### Sous Windows :
```powershell
.\scripts\Remove-DbAccess.ps1
```

Après avoir exécuté le script, redémarrez les conteneurs pour appliquer les changements :
```bash
docker-compose -f compose-production.yml down
docker-compose -f compose-production.yml up -d
```

### Informations de connexion

Une fois l'accès configuré, vous pouvez vous connecter à la base de données avec les informations suivantes :

- **Hôte** : L'adresse IP de votre serveur
- **Port** : 5432
- **Base de données** : aystone

### Exemple de connexion avec psql

```bash
psql -h <adresse_ip_serveur> -p 5432 -U postgres -d aystone
```

### Exemple de connexion avec pgAdmin

1. Ouvrez pgAdmin
2. Cliquez sur "Add New Server"
3. Dans l'onglet "General", donnez un nom à votre connexion
4. Dans l'onglet "Connection", entrez les informations suivantes :
   - Host name/address : <adresse_ip_serveur>
   - Port : 5432
   - Maintenance database : postgres
5. Cliquez sur "Save"

### Considérations de sécurité

L'exposition du port de la base de données à distance présente des risques de sécurité. Pour une utilisation en production, il est recommandé de :

1. Modifier les identifiants par défaut (utilisateur et mot de passe)
2. N'autoriser l'accès qu'à des adresses IP spécifiques et de confiance
3. Désactiver l'accès distant lorsqu'il n'est plus nécessaire
4. Utiliser un tunnel SSH pour les connexions à distance
5. Envisager l'utilisation d'un VPN pour sécuriser les connexions à la base de données

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
