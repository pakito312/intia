# README — Déploiement de la plateforme INTIA (Apache + MySQL)

## 1. Présentation
Ce document décrit la procédure de déploiement d’une application Laravel 10 + React + Inertia.js sur un serveur Apache2 avec MySQL. L’objectif est de fournir un guide reproductible pour une mise en production fiable.

## 2. Prérequis serveur

### 2.1 Logiciels nécessaires
- Apache2
- PHP 8.1+
- MySQL 5.7+ / MariaDB 10+
- Composer
- Node.js 18+ / npm

### 2.2 Extensions PHP obligatoires
- pdo_mysql
- mbstring
- tokenizer
- xml
- curl
- fileinfo
- openssl
- gd (si upload d’images)

## 3. Déploiement du code

### 3.1 Cloner le projet
```bash
cd /var/www
git clone https://github.com/pakito312/intia.git
cd intia-assurance
```

### 3.2 Installer les dépendances PHP
```bash
composer install --no-dev --optimize-autoloader
```

### 3.3 Installer les dépendances front-end et builder
```bash
npm install
npm run build
```

## 4. Configuration du fichier .env

### 4.1 Copier le fichier d’environnement
```bash
cp .env.example .env
```

### 4.2 Exemple de configuration MySQL
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=intia_db
DB_USERNAME=intia_user
DB_PASSWORD=mot_de_passe_secure
```

### 4.3 Configurer l’URL de l’application
```env
APP_URL=https://intia.mondomaine.com
```
### 4.3.1 Utilisation en local

Si vous voulez exécuter l’application en local (développement), voici quelques options rapides et variables d’exemple à ajuster dans .env :

- Variables d’environnement recommandées pour le local :
```env
APP_ENV=local
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=intia_local
DB_USERNAME=root
DB_PASSWORD=        # laisser vide si XAMPP/MAMP par défaut
```

- Avec PHP built-in server (rapide) :
```bash
composer install
npm install
npm run dev         # ou npm run watch pour Vite en dev
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8000
```

- Avec XAMPP (Windows) / MAMP (macOS) :
    - Copier le projet dans le dossier web (ex. C:/xampp/htdocs/intia-assurance).
    - Mettre APP_URL=http://localhost/intia-assurance si vous servez via Apache.
    - Vérifier que MySQL (MariaDB) est démarré dans XAMPP/MAMP.
    - Lancer composer/npm puis migrations comme ci‑dessus.

- Avec Laravel Valet (macOS/Linux) :
```bash
valet park        # dans le dossier parent
cd intia-assurance
composer install
npm install
npm run dev
php artisan migrate --seed
# acces via http://intia-assurance.test (ou nom choisi)
```

- Permissions locales : sur Linux/macOS assurer storage et bootstrap/cache inscriptibles :
```bash
sudo chown -R $USER:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache
```

Conseil : utiliser npm run dev pour le développement (hot reload) et npm run build pour préparer une version de production.
### 4.4 Générer la clé d’application
```bash
php artisan key:generate
```

## 5. Préparation de la base de données

### 5.1 Créer la base de données
```sql
CREATE DATABASE intia_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5.2 Exécuter les migrations
```bash
php artisan migrate:fresh --seed
```

### 5.3 (Optionnel) Importer les données initiales
```bash
php artisan db:seed --force
```

## 6. Configuration d’Apache

### 6.1 Activer les modules nécessaires
```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

### 6.2 VirtualHost
Créer le fichier `/etc/apache2/sites-available/intia.conf` :
```apache
<VirtualHost *:80>
    ServerName intia.mondomaine.com
    DocumentRoot /var/www/intia-assurance/public

    <Directory /var/www/intia-assurance/public>
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/intia_error.log
    CustomLog ${APACHE_LOG_DIR}/intia_access.log combined
</VirtualHost>
```

Pour HTTPS, ajouter une configuration SSL (certbot / Let’s Encrypt recommandé).

### 6.3 Activer le site
```bash
sudo a2ensite intia.conf
sudo systemctl reload apache2
```

## 7. Optimisation pour la production
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

## 8. Permissions des dossiers
```bash
sudo chown -R www-data:www-data /var/www/intia-assurance
sudo chmod -R 775 storage
sudo chmod -R 775 bootstrap/cache
```

## 9. Vérification du déploiement
Accéder à : http://intia.mondomaine.com

Vérifier :
- Authentification OK
- Pages Inertia chargées
- Connexion MySQL opérationnelle
- Logs propres (Apache / Laravel)

## 10. Maintenance

### 10.1 Mise à jour du code en production
```bash
git pull
composer install --no-dev --optimize-autoloader
npm run build
php artisan migrate --force
php artisan optimize
```

### 10.2 Redémarrer les services si nécessaire
```bash
sudo systemctl restart apache2
sudo systemctl restart php8.1-fpm   # si PHP-FPM utilisé
```

## 11. Monitoring minimal
Ajouter une route de santé :
```php
Route::get('/health-check', fn() => ['status' => 'ok']);
```
### 11.1 Accès au Monitoring

- URL d’accès (local uniquement) :
  - PHP built-in : http://127.0.0.1:8000/telescope

## 12. Test
Il faut se connecter en utilisant les identifiant email/password suivant

    - admin1@intial.local/Intial@123
    - admin2@intial.local/Intial@123

    
Surveiller via :
- UptimeRobot / BetterUptime
- Logs Apache et Laravel

----
Notes rapides :
- Utiliser des variables d’environnement sûres pour les mots de passe.
- Configurer HTTPS en production (Let’s Encrypt recommandé).
- Sauvegarder la base avant toute migration destructive.
- Ajuster les versions/chemins selon votre environnement.