FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libonig-dev libpng-dev libjpeg-dev libfreetype6-dev \
    libxml2-dev zip curl npm && \
    docker-php-ext-install pdo_mysql mbstring zip exif pcntl bcmath gd

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Install wait-for-it.sh
RUN curl -sSL https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -o /usr/local/bin/wait-for-it.sh && chmod +x /usr/local/bin/wait-for-it.sh

# Set working directory
WORKDIR /var/www/html

# Copy Laravel app
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

EXPOSE 9000
CMD ["php-fpm"]