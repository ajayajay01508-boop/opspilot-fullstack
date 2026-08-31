FROM php:8.3-cli
RUN pecl install mongodb && docker-php-ext-enable mongodb
WORKDIR /app
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY . ./
RUN composer install --no-dev --optimize-autoloader
EXPOSE 8080
CMD ["php","-S","0.0.0.0:8080","-t","public"]
