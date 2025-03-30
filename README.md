First Clone the Repo
git clone https://github.com/mic171997/Web_Apps.git

* Enable extension=sodium in php.ini

*For Laravel Backend
  
* cd path/to/your/laravel/Web_Apps/BACKEND
* composer install
* cp .env.example .env
* Open .env file and change database name of your own (Optional)
* php artisan key:generate
* composer require php-open-source-saver/jwt-auth:2.6.0
* php artisan jwt:secret
* php artisan migrate
* php artisan storage:link
* php artisan db:seed
* php artisan serve

*For FrontEnd

* cd path/to/your/laravel/Web_Apps/frontend
* npm install
* npm start

