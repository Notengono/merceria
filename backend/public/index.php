<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

require __DIR__ . '/../vendor/autoload.php';

// $app = new \Slim\App;

session_start();

// Instantiate the app
$settings = require __DIR__ . '/../src/settings.php';
$app = new \Slim\App($settings);

// Set up dependencies
require __DIR__ . '/../src/dependencies.php';

require __DIR__ . '/../src/middleware.php';
require __DIR__ . '/../src/auth.php';
// require __DIR__ . '/../src/routes.php';

// require __DIR__ . '/../src/users.php';
// require __DIR__ . '/../src/productos.php';
require __DIR__ . '/../src/categorias.php';

$app->run();
