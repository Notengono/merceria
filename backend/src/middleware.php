<?php
use Firebase\JWT\ExpiredException;
use Firebase\JWT\JWT;

$a = function ($request, $response, $next) {
    $params = $request->getServerParams();
    $authorization = $params['HTTP_AUTHORIZATION'];
    $authorization = explode(' ', $authorization);
    $jwt = $authorization[1];
    $settings = $this->get('settings'); // get settings array.
    try {
        // $dato = JWT::decode($jwt, $key, ["HS256"]);
        // var_dump($jwt);
        $dato = JWT::decode($jwt, $settings["jwt"]["secret"], array('HS256'));
        $response = $next($request->withAttribute('tincho', $jwt), $response);
        // $response->getBody()->write(date("Y-m-d H:i:s", $dato->exp));
        // } catch (ExpiredException $t) {
    } catch (\Exception $t) {
        $t->getMessage();
        $dato = array('mensaje' => 'Debe iniciar sesion.', 'error' => 401, $t);
        // $response->getBody()->write(401);
        // $response->getBody()->write($dato);

        return $response->withJson($dato, 401);
        // return $this->response->withJson($todos);
        // return $response->withRedirect('http://localhost/turnera/backend/public/TodosLosturnos', 301);
    }

    return $response;
};


$b = function ($request, $response, $next) {
    $response->getBody()->write('Primero <br>');

    $response = $next($request, $response);

    $response->getBody()->write('<br> Último');

    return $response;
};

// $app->add($a);

// use Firebase\JWT\JWT;

// $time = time();
// $key = 'my_secret_key';

// $token = array(
//     'iat' => $time, // Tiempo que inició el token
//     'exp' => $time + (60*60), // Tiempo que expirará el token (+1 hora)
//     'data' => [ // información del usuario
//         'id' => 1,
//         'name' => 'Eduardo'
//         ]
// );

// $jwt = JWT::encode($token, $key);

// $data = JWT::decode($jwt, $key, array('HS256'));

// var_dump($jwt);
// var_dump($data);