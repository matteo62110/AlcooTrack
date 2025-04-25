# Utiliser une image PHP avec FPM
FROM php:8.1-fpm

# Installer les dépendances PHP nécessaires pour Laravel
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

# Installer Node.js pour Vue.js
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs

# Installer nginx pour servir Laravel
RUN apt-get install -y nginx

# Définir le répertoire de travail pour l'application Laravel
WORKDIR /var/www

# Copier tous les fichiers dans le conteneur Docker
COPY . .

# Installer les dépendances PHP et Node.js
RUN composer install && npm install

# Construire le frontend Vue.js
RUN npm run build

# Exposer le port 80 pour nginx
EXPOSE 80

# Copier la configuration nginx
COPY nginx/default.conf /etc/nginx/sites-available/default

# Lancer PHP-FPM et nginx
CMD service php8.1-fpm start && nginx -g 'daemon off;'
