FROM php:8.3-cli-alpine

# Install SQLite development libraries
RUN apk add --no-cache sqlite-dev

# Install PDO SQLite PHP extension
RUN docker-php-ext-install pdo pdo_sqlite

# Install Composer from official image
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy project files
WORKDIR /var/www/html
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions for storage/cache
RUN chmod -R 777 storage bootstrap/cache

# Expose server port
EXPOSE 8000

# Start application server
CMD php artisan serve --host=0.0.0.0 --port=8000
