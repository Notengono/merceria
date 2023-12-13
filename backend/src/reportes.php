<?php
// $app->group('', function (\Slim\App $app) {
$app->group('', function (\Slim\App $app) {
    $app->get('/stocktodoslosproductos/[{oficina}]', function ($request, $response, $args) {
        $oficina = $args['oficina'];
        $sth = $this->db->prepare("SELECT * FROM stocktodoslosproductos_nuevo
            WHERE oficina = :oficina ORDER BY productos_descripcion;");
        $sth->bindParam("oficina", $oficina);
        $sth->execute();
        $todos = $sth->fetchAll();
        return $this->response->withJson($todos);
    });
});
// ->add($a);

$app->get(
    '/stockPorOficina/{oficina}',
    function ($request, $response, $args) {
        $sth = $this->db->prepare("SELECT * FROM stockproductos
                                WHERE oficina = :oficina
                                ORDER BY productos_descripcion;");
        $sth->bindParam("oficina", $args['oficina']);
        $sth->execute();
        $todos = $sth->fetchAll();
        return $this->response->withJson($todos);
    }
);

// Stock por oficina agrupado por lote
$app->get(
    '/stockPorOficinaLote/{oficina}',
    function ($request, $response, $args) {
        $sth = $this->db->prepare("SELECT m.id, productos_descripcion, lote_id, lote_numero, 
            lote_vencimiento, SUM(mov_cantidad * tipo_mov_suma) AS cantidad, lote_remediar
                FROM movimientos m
                inner join tipo_mov tm ON tm.id = m.tipo_mov_id
                left join lotes l ON l.id = m.lote_id
                left join productos p ON p.id = l.producto_id
                WHERE oficina_id = :oficina
                GROUP BY oficina_id, lote_id
                ORDER BY productos_descripcion, lote_vencimiento;");
        $sth->bindParam("oficina", $args['oficina']);
        $sth->execute();

        $todos = $sth->fetchAll();


        return $this->response->withJson($todos);
    }
);

$app->get(
    '/stockUnProducto/{oficina}/{idProducto}',
    function ($request, $response, $args) {
        $sth = $this->db->prepare("SELECT * FROM stocktodoslosproductos_nuevo
            WHERE oficina = :oficina AND producto_id = :idProducto;");
        $sth->bindParam("oficina", $args['oficina']);
        $sth->bindParam("idProducto", $args['idProducto']);
        $sth->execute();

        $todos = $sth->fetchAll();
        return $this->response->withJson($todos);
    }
);

$app->get('/clearingPorOficina/{oficina}', function ($request, $response, $args) {
    $sth = $this->db->prepare("SELECT * FROM `clearingporoficina_vw` WHERE oficina = :oficina;");
    $sth->bindParam("oficina", $args['oficina']);
    $sth->execute();
    $todos = $sth->fetchAll();
    return $this->response->withJson($todos);
});

$app->get('/clearingPorOficinaDetalle/{clearing}', function ($request, $response, $args) {
    $sth = $this->db->prepare("SELECT mov_cantidad AS cantidad, lote_numero AS lote, DATE_FORMAT(lote_vencimiento, '%d/%m/%Y') AS vencimiento,
        IF(lote_remediar = 's', CONCAT(productos_descripcion, ' (Remediar)'), productos_descripcion) AS producto
        from movimientos m
        left join lotes l ON l.id = m.lote_id
        left join productos p ON p.id = l.producto_id
        where clearing_id = :clearing;");
    $sth->bindParam("clearing", $args['clearing']);
    $sth->execute();
    $todos = $sth->fetchAll();
    return $this->response->withJson($todos);
});

$app->get('/getProductosStockHasta/{oficina}/{hasta}', function ($request, $response, $args) {
    $oficina = $args['oficina'];
    $hasta = $args['hasta'];
    $sth = $this->db->prepare("SELECT producto, SUM(cantidad) AS remito, oficina, productos_descripcion, productos_barra
                        FROM remitos_cantidad_vw
                        LEFT JOIN productos p ON p.id = producto
                            WHERE oficina = :oficina AND fecha <= :hasta
                            GROUP BY producto;");
    // AND lote_vencimiento >= :hasta
    $sth->bindParam("oficina", $oficina);
    $sth->bindParam("hasta", $hasta);
    $sth->execute();
    $todos = $sth->fetchAll();

    $sth = $this->db->prepare("SELECT producto, SUM(cantidad) AS cantidad, oficina FROM recetas_cantidad_vw 
                                WHERE oficina = :oficina AND fecha <= :hasta group by producto, oficina;");
    $sth->bindParam("oficina", $oficina);
    $sth->bindParam("hasta", $hasta);
    $sth->execute();

    $recetas_aux = $sth->fetchAll();

    $sth = $this->db->prepare("SELECT producto_id AS producto, SUM(tipo_mov_suma*mov_cantidad) AS cantidad
                                FROM movimientos m
                                LEFT JOIN tipo_mov tm ON m.tipo_mov_id = tm.id
                                WHERE oficina_id = :oficina AND fecha_cabecera <= :hasta AND remito_id IS NULL AND receta_id IS NULL
                                GROUP BY producto_id, oficina_id;");
    $sth->bindParam("oficina", $oficina);
    $sth->bindParam("hasta", $hasta);
    $sth->execute();

    $otros_aux = $sth->fetchAll();

    // var_dump($otros_aux);
    foreach ($todos as $key => $value) {
        foreach ($recetas_aux as $key1 => $value1) {
            $todos[$key]['receta'] = '0';
            if ($todos[$key]['producto'] == $value1['producto']) {
                $todos[$key]['receta'] = ($value1['cantidad'] != null) ? $value1['cantidad'] : '0';
                break;
            }
        }
        // foreach ($otros_aux as $key2 => $value2) {
        //     $todos[$key]['otros'] = '0';
        //     if ($todos[$key]['producto'] == $value2['producto']) {
        //         $todos[$key]['otros'] = ($value2['cantidad'] != null) ? $value2['cantidad'] : '0';
        //         break;
        //     }
        // }
    }

    foreach ($todos as $key => $value) {
        foreach ($otros_aux as $key2 => $value2) {
            $todos[$key]['otros'] = '0';
            if ($todos[$key]['producto'] == $value2['producto']) {
                $todos[$key]['otros'] = ($value2['cantidad'] != null) ? $value2['cantidad'] : '0';
                break;
            }
        }
    }



    // foreach ($todos as $key => $value) {
    //         /*AND lote_vencimiento >= :hasta*/
    //     $sth = $this->db->prepare("SELECT producto, SUM(cantidad) AS cantidad, oficina
    //     FROM recetas_cantidad_vw
    //     WHERE oficina = :oficina AND fecha <= :hasta
    //         AND producto = :producto;");
    //     $sth->bindParam("oficina", $oficina);
    //     $sth->bindParam("hasta", $hasta);
    //     $sth->bindParam("producto", $value['producto']);
    //     $sth->execute();
    //     $valor = $sth->fetchObject();

    //     $todos[$key]['receta'] = ($valor->cantidad != null) ? $valor->cantidad : '0';
    // }

    return $this->response->withJson($todos);
});
$app->get('/getProductoEntregado/{oficina}/{dato1}/{dato2}/{dato3}', function ($request, $response, $args) {
    $oficina = $args['oficina'];
    $producto = $args['dato1'];
    $desde = $args['dato2'];
    $hasta = $args['dato3'];

    $sth = $this->db->prepare("SELECT mov_cantidad, lote_id, receta_id, oficina_id, DATE_FORMAT(receta_fecha, '%d/%m/%Y') AS fecha,
                                establecimiento_id, matricula, CONCAT(apellido, ', ', nombre) AS medico, personaDNI, 
                                CONCAT(personaApellido, ', ', personaNombre) AS paciente, personaSexo
                                FROM movimientos m
                                LEFT JOIN recetas r ON m.receta_id = r.id
                                LEFT JOIN medicos_vw me on me.medico_id = r.medico_id
                                LEFT JOIN pacientes_vw p on p.id = r.paciente_id
                                WHERE receta_id is not null AND oficina_id = :oficina
                                AND receta_fecha BETWEEN :desde AND :hasta AND
                                lote_id in (SELECT id FROM `lotes` where producto_id = :producto);");

    $sth->bindParam("oficina", $oficina);
    $sth->bindParam("hasta", $hasta);
    $sth->bindParam("desde", $desde);
    $sth->bindParam("producto", $producto);
    $sth->execute();
    $todos = $sth->fetchAll();

    return $this->response->withJson($todos);
});

$app->put('/buscarMovimientosAjuste/{oficina}', function ($request, $response, $args) {
    $oficina = $args['oficina'];
    $input = $request->getParsedBody();

    $sth = $this->db->prepare("SELECT idajustes AS numero, fecha_ajuste, motivo AS motivo_desc, mov_cantidad AS cantidad,
                                        tipo_mov_descripcion AS motivo, oficina_id, productos_descripcion AS producto
                                FROM `ajustes` a
                                LEFT JOIN movimientos m ON a.idmovimiento = m.id
                                LEFT JOIN productos p ON p.id = m.producto_id
                                LEFT JOIN tipo_mov tm ON tm.id = m.tipo_mov_id
                                WHERE receta_id is null AND remito_id is null AND clearing_id is null
                                AND fecha_ajuste BETWEEN :desde AND :hasta AND oficina_id = :oficina ;");

    $input['hasta'] = $input['hasta'] . ' 23:59:59';
    $input['desde'] . ' 00:00:00';
    $sth->bindParam("oficina", $oficina);
    $sth->bindParam("hasta", $input['hasta']);
    $sth->bindParam("desde", $input['desde']);

    $sth->execute();
    $todos = $sth->fetchAll();

    return $this->response->withJson($todos);
});

$app->put('/buscarMovimientosClearing/{oficina}', function ($request, $response, $args) {
    $oficina = $args['oficina'];
    $input = $request->getParsedBody();

    $sth = $this->db->prepare("SELECT c.id, fecha, emisor_id, receptor_id, servicio_descripcion, tipo_servicio_id
                                FROM `clearings` c
                                    LEFT JOIN servicios s ON s.id = c.receptor_id
                                WHERE emisor_id = :oficina AND fecha BETWEEN :desde AND :hasta;");
    $input['hasta'] = $input['hasta'] . ' 23:59:59';
    $input['desde'] . ' 00:00:00';
    $sth->bindParam("oficina", $oficina);
    $sth->bindParam("hasta", $input['hasta']);
    $sth->bindParam("desde", $input['desde']);

    $sth->execute();
    $todos['clearing'] = $sth->fetchAll();


    $sth = $this->db->prepare("SELECT m.id, mov_cantidad, tipo_mov_id, clearing_id, productos_descripcion
                                FROM movimientos m LEFT JOIN productos p ON p.id = m.producto_id
                                WHERE clearing_id IN (SELECT id FROM clearings WHERE emisor_id = :oficina AND fecha BETWEEN :desde AND :hasta);");

    $sth->bindParam("oficina", $oficina);
    $sth->bindParam("hasta", $input['hasta']);
    $sth->bindParam("desde", $input['desde']);

    $sth->execute();
    $todos['movimiento'] = $sth->fetchAll();

    return $this->response->withJson($todos);
});
