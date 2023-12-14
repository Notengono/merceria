<?php

// grabar una categoria
$app->post('/categoria', function ($request, $response) {
    $input = $request->getParsedBody();
    $sql = "INSERT INTO grupos (idgrupo, descripcion) VALUES (null, :descripcion)";
    $sth = $this->db->prepare($sql);
    $sth->bindParam("descripcion", $input['descripcion']);

    if (!$sth->execute()) {
        $input['estado'] = 402;
        $input['error'] = 'Error al grabar el registro.';
        return $this->response->withJson($input);
    } else {
        $input['id'] = $this->db->lastInsertId();
        $input['estado'] = 200;
        $input['error'] = 'El registro se almacenó correctamente.';
    }
    return $this->response->withJson($input);
});

$app->get('/categorias', function ($request, $response) {
    $sth = $this->db->prepare("SELECT * FROM `grupos` ORDER BY descripcion;");
    $sth->execute();
    $resultado = $sth->fetchAll();
    return $this->response->withJson($resultado);
});

$app->get('/subcategorias/{valor}', function ($request, $response, $args) {
    $valor = $args['valor'];
    $sth = $this->db->prepare("SELECT * FROM `subgrupos` WHERE idgrupo = :grupo ORDER BY descripcion;");
    $sth->bindParam('grupo', $valor);
    
    $sth->execute();
    $resultado = $sth->fetchAll();
    
    var_dump($resultado);

    if (count($resultado) == 0) {
        $input['resultado'] = false;
        $input['estado'] = 404;
        $input['error'] = 'No se encontraron resultados.';
    } else {
        $input['resultado'] = $resultado;
        $input['estado'] = 200;
        $input['error'] = 'Se encontraron ' + count($resultado) + ' resultados.';
    }

    return $this->response->withJson($input, $input['estado']);
});

// $app->put('/medicos/habilitarMedico', function ($request, $response) {
//     $input = $request->getParsedBody();
//     $sth = $this->db->prepare("UPDATE medicos SET vigente = :habilitado
//         WHERE id=:id");
//     $sth->bindParam("id", $input['id']);
//     $sth->bindParam("habilitado", $input['habilitado']);
//     $resultado = $sth->execute();

//     return $this->response->withJson($resultado);
// });


// $app->get('/prueba', function ($request, $response) {
//     // $sth = $this->db->prepare("SELECT * FROM `movimientos` m LEFT JOIN oficinas o ON o.id = m.oficina_id where oficina_id = 39;");
//     $sth = $this->db->prepare("CREATE TEMPORARY TABLE if not exists  `farmacia`.`prueba` LIKE movimientos ;");
//     $sth->execute();

//     $sth = $this->db->prepare("INSERT INTO prueba SELECT * FROM `movimientos` where oficina_id = 39;");
//     $sth->execute();

//     $sth = $this->db->prepare("UPDATE prueba SET mov_cantidad = (mov_cantidad + 1);");
//     $sth->execute();

//     $sth = $this->db->prepare("SELECT p.id, mov_cantidad, lote_id, producto_id, tipo_mov_id, receta_id, remito_id, clearing_id
//     FROM prueba p LEFT JOIN oficinas o ON o.id = p.oficina_id;");
//     $sth->execute();
//     $resultado = $sth->fetchAll();
//     return $this->response->withJson($resultado);
// });
