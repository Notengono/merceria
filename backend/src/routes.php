<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

$app->group('', function (\Slim\App $grupo) {
    $grupo->get('/', function ($request, $response, $args) {
        $response->getBody()->write("Bienvenido al Inicio");
        return $response;
    });

    $grupo->get('/hello/{name}', function (Request $request, Response $response, array $args) {
        $name = $args['name'];
        $response->getBody()->write("Hello, $name");
        return $response;
    });
})->add($a);

// $app->group('/tin', function (\Slim\App $grupo) {

//     $grupo->get('/tibu/{name}', function (Request $request, Response $response, array $args) {
//         $name = $args['name'];
//         $response->getBody()->write("Hello, $name");
//         return $response;
//     });
// })->add($b);