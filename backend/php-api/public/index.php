<?php
require dirname(__DIR__).'/vendor/autoload.php';
use OpsPilot\App;
$app = new App();
$app->handle($_SERVER['REQUEST_METHOD'], parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
