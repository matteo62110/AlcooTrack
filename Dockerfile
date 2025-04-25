# Utilise une image PHP avec FPM
FROM php:8.1-fpm

# Mise à jour des paquets et installation des dépendances système nécessaires
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

# Installer Node.js et npm
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs

# Définir le répertoire de travail
WORKDIR /var/www

# Copier tous les fichiers dans le conteneur
COPY . .

# Installer les dépendances PHP et Node.js
RUN composer install && npm install

# Exposer le port 80
EXPOSE 80

# Commande pour démarrer Laravel
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=80"]
