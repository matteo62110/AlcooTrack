# Utiliser une image PHP officielle
FROM php:8.1-fpm

# Installer les dépendances pour Laravel
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    zip \
    git \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd \
    && docker-php-ext-install pdo pdo_mysql

# Installer Composer (gestionnaire de dépendances PHP)
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Installer Node.js et npm (pour Vue.js)
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs

# Créer un répertoire pour l'application
WORKDIR /var/www

# Copier les fichiers du projet dans l'image Docker
COPY . .

# Installer les dépendances PHP et Node.js
RUN composer install && npm install

# Construire le frontend avec Vue.js
RUN npm run build

# Exposer le port utilisé par l'application Laravel
EXPOSE 80

# Commande pour démarrer le serveur Laravel
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=80"]
