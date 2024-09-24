<?php

use Slim\Http\Request;
use Slim\Http\Response;
use \Firebase\JWT\JWT;

$app->post('/login', function ($request, $response, array $args) {
    $input = $request->getParsedBody();
    $sql = "SELECT * FROM users u WHERE user_name = :username";
    $sth = $this->db->prepare($sql);
    $sth->bindParam("username", $input['username']);
    $sth->execute();
    $user = $sth->fetchObject();

    // var_dump($user);
    // verify email address.
    if (!$user) {
        // var_dump(['error' => true, 'message' => 'Acceso incorrecto. Usuario no encontrado']);
        return $this->response->withJson(
            ['error' => true, 'message' => 'Acceso incorrecto. Usuario no encontrado'], 401
        );
    } 
    // else {
    //     if ($user->intentos >= 3) {
    //         return $this->response->withJson(
    //             ['error' => true, 'message' => 'USUARIO BLOQUEADO.'],
    //             401
    //         );
    //     }
    // }

    if (hash('sha256', $input['password']) != $user->user_pass) {
        $sql = "UPDATE users SET intentos = (intentos + 1) WHERE user_name = :username";
        $sth = $this->db->prepare($sql);
        $sth->bindParam("username", $input['username']);
        $sth->execute();

        return $this->response->withJson(
            ['error' => true, 'message' => 'Acceso incorrecto. ' . $user->intentos . ' de 7 Intentos fallidos'],
            401
        );
    } else {
        $sql = "UPDATE users SET intentos = 0, ultima_conexion = NOW() WHERE user_name = :username";
        $sth = $this->db->prepare($sql);
        $sth->bindParam("username", $input['username']);
        $sth->execute();
        $settings = $this->get('settings'); // get settings array.

        $usuario = array(
            'id' => $user->id,
            'user_name' => $user->user_name,
            'user_pass' => $user->user_pass,
            'user_baja' => $user->user_baja,
            'nombre' => $user->nombre,
            'created' => $user->created,
            'ultima_conexion' => $user->ultima_conexion,
            'intentos' => $user->intentos
        );


        $payload = [
            'iat' => time(),
            'exp' => time() + 30000,
            'id' => $user->id,
            'username' => $user->user_name
        ];

        $token = JWT::encode($payload, $settings['jwt']['secret'], "HS256");

        return $this->response->withJson(['token' => $token, 'user' => $usuario], 202);
    }
});

$app->get("/logout", function ($request, $response, $args) {

    $data = ["status" => 1, 'msg' => "No need of token to access me"];

    return $response->withStatus(200)
        ->withHeader("Content-Type", "application/json")
        ->write(json_encode($data, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
});

// get all users
$app->get('/users', function ($request, $response, $args) {
    $sth = $this->db->prepare("SELECT * FROM users");
    $sth->execute();
    $todos = $sth->fetchAll();
    return $this->response->withJson($todos);
});
