# Utiliser une image PHP officielle
FROM php:8.1-fpm

# Mise à jour des paquets et installation des dépendances nécessaires pour Laravel
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    zip \
    git \
    curl \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd \
    && docker-php-ext-install pdo pdo_mysql

# Installer Composer (gestionnaire de dépendances PHP)
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Installer Node.js et npm pour gérer le frontend
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs

# Définir le répertoire de travail pour l'application Laravel
WORKDIR /var/www

# Copier tous les fichiers du projet dans le conteneur Docker
COPY . .

# Installer les dépendances PHP et Node.js
RUN composer install && npm install

# Construire le frontend Vue.js
RUN npm run build

# Exposer le port 80 pour Laravel
EXPOSE 80

# Commande pour démarrer Laravel
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=80"]
