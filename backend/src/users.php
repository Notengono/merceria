<?php

use Slim\Http\Request;
use Slim\Http\Response;
use \Firebase\JWT\JWT;

// // Add a new todo
// $app->post('/user', function ($request, $response) {
//     $input = $request->getParsedBody();
//     $sql = "INSERT INTO users (username, password, baja, persona_id, nivel_id, oficina_id)
//                     VALUES (:username, :password, :baja, :persona_id, :nivel_id, :oficina_id)";
//     $sth = $this->db->prepare($sql);
//     $sth->bindParam("username", $input['username']);
//     $sth->bindParam("password", hash('sha256', $input['password']));
//     $sth->bindParam("baja", $input['baja']);
//     $sth->bindParam("persona_id", $input['persona']);
//     $sth->bindParam("nivel_id", $input['nivel']);
//     $sth->bindParam("oficina_id", $input['oficina']);
//     $sth->execute();
//     $input['id'] = $this->db->lastInsertId();
//     return $this->response->withJson($input);
// });

// get all users
$app->get('/usuario/listar/[{id}]', function ($request, $response, $args) {
    $sth = $this->db->prepare("SELECT u.id, u.user_name, u.user_baja, u.user_pass, 
    p.persona_nombre as per_nombre, p.persona_apellido as per_apellido, 
    n.nivel_descripcion FROM users u 
    LEFT JOIN personas p ON p.id = u.persona_id 
    LEFT JOIN niveles n ON n.id = u.nivel_id
    WHERE  oficina_id = :id");
    $sth->bindParam("id", $args['id']);
    $sth->execute();
    $todos = $sth->fetchAll();
    return $this->response->withJson($todos);
});

// get  user
$app->get('/usuario/buscar/[{id}]', function ($request, $response, $args) {
    $sth = $this->db->prepare("SELECT u.id, u.user_name, u.user_pass, u.persona_id, u.nivel_id, 
    p.persona_nombre, p.persona_apellido, 
    p.persona_dni, p.persona_email, 
    p.persona_telefono, p.persona_direccion
    FROM users u 
    LEFT JOIN personas p ON p.id = u.persona_id     
    WHERE u.id = :id");
    $sth->bindParam("id", $args['id']);
    $sth->execute();
    $todos = $sth->fetchAll();
    return $this->response->withJson($todos);
});

// Añadir una nueva persona y paciente


$app->post('/usuario/nuevo', function ($request, $response) {
    // var_dump($request->getParsedBody());

    $input = $request->getParsedBody();
    $sql = "INSERT INTO personas (persona_nombre, persona_apellido, persona_dni, persona_email, 
    persona_telefono, persona_direccion, persona_sexo, localidad_id)
    VALUES (:nombre, :apellido, :dni, :email, :telefono, :direccion, :sexo, :localidad)";

    $sth = $this->db->prepare($sql);

    $sth->bindParam("nombre", $input['personaNombre']);
    $sth->bindParam("apellido", $input['personaApellido']);
    $sth->bindParam("dni", $input['personaDni']);
    $sth->bindParam("sexo", $input['personaSexo']);

    $sth->bindParam("direccion", $input['personaDireccion']);
    $sth->bindParam("email", $input['personaEmail']);
    $sth->bindParam("telefono", $input['personaTelefono']);
    $sth->bindParam("localidad", $input['localidad']);

    $sth->execute();

    $input['id'] = $this->db->lastInsertId();

    /* Almaceno los datos del usuario */
    $input['userPassword'] = hash('sha256', $input['userPass']);

    $sql = "INSERT INTO users (user_name, user_pass, user_baja, persona_id, nivel_id, oficina_id)
    VALUES (:_username, :_password, 0, :persona_id, 3, :oficina_id)";
    $sth = $this->db->prepare($sql);

    // var_dump($input['id']);

    $sth->bindParam("_username", $input['userName']);
    $sth->bindParam("_password", $input['userPassword']);
    // $sth->bindParam("baja", '0');
    $sth->bindParam("persona_id", $input['id']);

    $sth->bindParam("oficina_id", $input['oficina']);
    $sth->execute();
    // -------------
    $usuario = $this->db->lastInsertId();
    $rol = (int)$input['nivel'];
    $sql = "INSERT INTO users_rol (user_id, rol_id)
    VALUES (:user_id,  :rol_id)";
    $sth = $this->db->prepare($sql);
    $sth->bindParam("user_id", $usuario);
    $sth->bindParam("rol_id", $rol);

    $sth->execute();

    $input['estado'] = 200;
    $input['error'] = 'El registro se almacenó correctamente.';

    return $this->response->withJson($input);
});




$app->put('/usuario/editar', function ($request, $response) {
    // var_dump($request->getParsedBody());

    $input = $request->getParsedBody();
    $sql = "UPDATE personas SET persona_nombre = :nombre, persona_apellido = :apellido, 
  persona_dni = :dni, persona_email = :email, 
  persona_telefono = :telefono, persona_direccion = :direccion, persona_sexo = :sexo, localidad_id = :localidad 
  WHERE id = :personaId";

    $sth = $this->db->prepare($sql);

    $sth->bindParam("personaId", $input['personaId']);
    $sth->bindParam("nombre", $input['personaNombre']);
    $sth->bindParam("apellido", $input['personaApellido']);
    $sth->bindParam("dni", $input['personaDni']);
    $sth->bindParam("sexo", $input['personaSexo']);

    $sth->bindParam("direccion", $input['personaDireccion']);
    $sth->bindParam("email", $input['personaEmail']);
    $sth->bindParam("telefono", $input['personaTelefono']);
    $sth->bindParam("localidad", $input['localidad']);

    $sth->execute();

    /* Almaceno los datos del usuario */
    $input['userPassword'] = hash('sha256', $input['userPass']);



    $sql = "UPDATE users SET user_name = :_username, nivel_id = :nivel_id WHERE id = :userId";
    $sth = $this->db->prepare($sql);

    // var_dump($input['id']);

    $sth->bindParam("_username", $input['userName']);
    $sth->bindParam("userId", $input['userId']);
    $sth->bindParam("nivel_id", $input['nivel']);

    $sth->execute();

    $input['estado'] = 200;
    $input['error'] = 'El registro se edito correctamente.';

    return $this->response->withJson($input);
});


$app->put('/usuario/editarBloquearDesbloquear', function ($request, $response) {

    $input = $request->getParsedBody();
    $sql = "UPDATE users SET  user_baja = :user_baja WHERE id = :userId";
    $sth = $this->db->prepare($sql);


    $sth->bindParam("user_baja", $input['user_baja']);
    $sth->bindParam("userId", $input['userId']);
    $sth->execute();

    $input['estado'] = 200;
    $input['error'] = 'El registro se edito correctamente.';

    return $this->response->withJson($input);
});

$app->put('/usuario/editarRestablecerPass', function ($request, $response) {

    $input = $request->getParsedBody();
    $sql = "UPDATE users SET  user_pass = :user_pass WHERE id = :userId";
    $sth = $this->db->prepare($sql);

    /* Almaceno los datos del usuario */
    $input['user_pass'] = hash('sha256', $input['user_pass']);

    $sth->bindParam("user_pass", $input['user_pass']);
    $sth->bindParam("userId", $input['userId']);
    $sth->execute();

    $input['estado'] = 200;
    $input['error'] = 'El registro se edito correctamente.';

    return $this->response->withJson($input);
});

$app->post('/login', function (Request $request, Response $response, array $args) {

    $input = $request->getParsedBody();
    $sql = "SELECT u.id, user_name, user_pass, user_baja, persona_id, nivel_id, oficina_id, 
    created, o.establecimiento_id, o.oficina_nombre as oficinaNombre, e.localidad_id, 
    e.est_nombre as estNombre, p.persona_nombre as personaNombre, u.intentos, DATE_FORMAT(ultima_conexion, '%d/%m/%Y a las %H:%i') AS ultima_conexion
    FROM users u 
    LEFT JOIN oficinas o ON o.id=u.oficina_id 
    LEFT JOIN establecimientos e ON e.id = o.establecimiento_id 
    LEFT JOIN personas p ON p.id = u.persona_id 
    WHERE user_name = :username";
    $sth = $this->db->prepare($sql);
    $sth->bindParam("username", $input['username']);
    $sth->execute();
    $user = $sth->fetchObject();

    // verify email address.
    if (!$user) {
        return $this->response->withJson(
            ['error' => true, 'message' => 'Acceso incorrecto. ' . $user->intentos . ' de 7 Intentos fallidos'],
            401
        );
    } else {
        if ($user->intentos >= 7) {
            return $this->response->withJson(
                ['error' => true, 'message' => 'USUARIO BLOQUEADO.'],
                401
            );
        }
    }

    // verify password.
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
            'nivel_id' => $user->nivel_id,
            'oficina_id' => $user->oficina_id,
            'establecimiento_id' => $user->establecimiento_id,
            'oficinaNombre' => $user->oficinaNombre,
            'estNombre' => $user->estNombre,
            'personaNombre' => $user->personaNombre,
            'ultima_conexion' => $user->ultima_conexion
        );


        $payload = [
            'iat' => time(),
            'exp' => time() + 36000,
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

// Search for todo with given search teram in their name
$app->get('/users/search/[{query}]', function ($request, $response, $args) {
    $sth = $this->db->prepare("SELECT * FROM users WHERE UPPER(username) LIKE :query ORDER BY username");
    $query = "%" . $args['query'] . "%";
    $sth->bindParam("query", $query);
    $sth->execute();
    $todos = $sth->fetchAll();
    return $this->response->withJson($todos);
});

$app->group('/api', function (\Slim\App $app) {

    $app->get('/user/[{id}]', function ($request, $response, $args) {
        $sth = $this->db->prepare("SELECT * FROM users WHERE id=:id");
        $sth->bindParam("id", $args['id']);
        $sth->execute();
        $todos = $sth->fetchObject();
        return $this->response->withJson($todos);
    });

    // DELETE a todo with given id
    $app->delete('/user/[{id}]', function ($request, $response, $args) {
        $sth = $this->db->prepare("DELETE FROM users WHERE id=:id");
        $sth->bindParam("id", $args['id']);
        $sth->execute();

        $data = ["status" => 'OK', 'msg' => "Registro eliminado correctamente"];
        return $response->withStatus(200)
            ->withHeader("Content-Type", "application/json")
            ->write(json_encode($data, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
    });

    // x-www-form-urlencoded: username
    $app->put('/user/[{id}]', function ($request, $response, $args) {
        $input = $request->getParsedBody();
        $sql = "UPDATE users SET username=:username, password=:password, persona_id=:persona, nivel_id=:nivel, oficina_id=:oficina, baja=:baja WHERE id=:id";
        $sth = $this->db->prepare($sql);
        $sth->bindParam("id", $args['id']);
        $sth->bindParam("username", $input['username']);
        $sth->bindParam("password", $input['password']);
        $sth->bindParam("persona", $input['persona']);
        $sth->bindParam("nivel", $input['nivel']);
        $sth->bindParam("oficina", $input['oficina']);
        $sth->bindParam("baja", $input['baja']);
        $sth->execute();
        $input['id'] = $args['id'];
        return $this->response->withJson($input);
    });

    $app->put('/CambioContrasena', function ($request, $response) {
        $input = $request->getParsedBody();
        $input['claveVieja'] = hash('sha256', $input['claveVieja']);
        $input['claveNueva'] = hash('sha256', $input['claveNueva']);

        $sql = "SELECT count(*) as cantidad FROM users WHERE id = :userId AND user_pass = :claveVieja";
        $sth = $this->db->prepare($sql);
        $sth->bindParam("claveVieja", $input['claveVieja']);
        $sth->bindParam("userId", $input['userId']);
        $sth->execute();

        $contador = $sth->fetchObject();
        if ($contador->cantidad > 0) {
            $sql = "UPDATE users SET user_pass = :claveNueva WHERE id = :userId AND user_pass = :claveVieja";
            $sth = $this->db->prepare($sql);

            /* Almaceno los datos del usuario */

            $sth->bindParam("claveVieja", $input['claveVieja']);
            $sth->bindParam("claveNueva", $input['claveNueva']);
            $sth->bindParam("userId", $input['userId']);
            if ($sth->execute()) {
                $input['estado'] = 200;
                $input['color'] = 'success';
                $input['error'] = 'El registro se edito correctamente.';
            } else {
                $input['estado'] = 401;
                $input['color'] = 'warn';
                $input['error'] = 'El registro se no se pudo ediar.';
            }
        } else {
            $input['estado'] = 401;
            $input['color'] = 'warn';
            $input['error'] = 'La clave es incorrecta.';
        }


        return $this->response->withJson($input);
    });
});
