<?php
$app->get(
    '/formas',
    function ($request, $response, $args) {
        $sth = $this->db->prepare("SELECT * FROM `formas` ORDER BY forma_descripcion;");
        $sth->execute();
        $todos = $sth->fetchAll();

        return $this->response->withJson($todos);
    }
);

$app->post(
    '/postDrogaNueva',
    function ($request, $response, $args) {
        $input = $request->getParsedBody();

        $sql = "INSERT INTO monodrogas (monodroga_descripcion) VALUES(:nombre);";
        $sth = $this->db->prepare($sql);
        $sth->bindParam("nombre", $input['nombre']);
        if (!$sth->execute()) {
            $input['estado'] = 402;
            $input['error'] = 'Error al grabar el producto.';
        } else {
            $input['estado'] = 200;
            $input['error'] = 'El producto se almacenó correctamente.';
        }
        return $this->response->withJson($input);
    }
);

$app->post(
    '/producto',
    function ($request, $response, $args) {
        $input = $request->getParsedBody();

        $sth = $this->db->prepare("SELECT id, productos_barra From productos
    where productos_descripcion = :producto");
        $sth->bindParam("producto", $input['producto']);
        $sth->execute();
        $prod = $sth->fetchObject();

        if (!$prod) {
            $sql = "INSERT INTO productos (productos_descripcion) VALUES(:producto);";
            $sth = $this->db->prepare($sql);
            $sth->bindParam("producto", $input['producto']);
            if (!$sth->execute()) {
                $input['estado'] = 402;
                $input['error'] = 'Error al grabar el producto.';
                return $this->response->withJson($input);
            }

            $input['id'] = $this->db->lastInsertId();

            // obtengo el código de barra concatenando 0 al id del producto.
            $barra = '';
            for ($i = 0; $i < (14 - strlen($input['id'])); $i++) {
                $barra .= strval(0);
            }
            $barra .= strval($input['id']);

            // Actualizo el código de barra
            $sth = $this->db->prepare("UPDATE productos SET productos_barra = :barra WHERE id = :id");
            $sth->bindParam("id", $input['id']);
            $sth->bindParam("barra", $barra);
            if (!$sth->execute()) {
                $input['estado'] = 403;
                $input['error'] = 'Error al grabar el código de barra.';
            }
            $input['estado'] = 200;
            $input['error'] = 'El producto se almacenó correctamente.';
            return $this->response->withJson($input);
        } else {
            $input['estado'] = 401;
            $input['error'] = 'El producto ya se encuentra registrado.';
            return $this->response->withJson($input);
        }
    }
);

$app->post('/StockPorProducto', function ($request, $response, $args) {

    $input = $request->getParsedBody();
    $sql = "SELECT m.id as id, m.mov_cantidad as mov_cantidad, 
    (`tm`.`tipo_mov_suma` * `m`.`mov_cantidad`) as cantidad,
        if(( m.remito_id), rem.remito_fecha, rec.receta_fecha) AS `fecha`, 
        if(( m.remito_id), YEAR(rem.remito_fecha), YEAR(rec.receta_fecha)) AS `anio`, 
        if(( m.remito_id), MONTH(rem.remito_fecha), MONTH(rec.receta_fecha)) AS `mes`, tm.tipo_mov_suma AS `suma`, 
        tm.tipo_mov_descripcion as tipo_mov_descripcion 
        FROM movimientos m 
        LEFT JOIN recetas rec ON m.receta_id = rec.id 
        LEFT JOIN remito rem ON m.remito_id = rem.id 
        LEFT JOIN tipo_mov tm ON tm.id = m.tipo_mov_id 

        WHERE oficina_id = :oficina and m.producto_id = :producto and m.tipo_mov_id IN (1, 2, 10) 

    UNION 

    SELECT m.id as id, m.mov_cantidad as mov_cantidad, 
    (`tm`.`tipo_mov_suma` * `m`.`mov_cantidad`) as cantidad,
        a.fecha_ajuste as `fecha`, YEAR(a.fecha_ajuste) AS `anio`, MONTH(a.fecha_ajuste) AS `mes`, 
        tm.tipo_mov_suma AS `suma`, tm.tipo_mov_descripcion as tipo_mov_descripcion 
        FROM ajustes a 
        left join movimientos m on a.idmovimiento = m.id 
        LEFT JOIN tipo_mov tm ON tm.id = m.tipo_mov_id 
        WHERE oficina_id = :oficina and m.producto_id = :producto and m.tipo_mov_id IN (3, 6, 9, 11, 12, 13, 14) 
        
    UNION

    SELECT m.id as id, m.mov_cantidad as mov_cantidad, 
    (`tm`.`tipo_mov_suma` * `m`.`mov_cantidad`) as cantidad,
    if((m.clearing_id), c.fecha, null) AS `fecha`, 
        YEAR(c.fecha) AS `anio`, MONTH(c.fecha) AS `mes`, tm.tipo_mov_suma AS `suma`, 
        tm.tipo_mov_descripcion as tipo_mov_descripcion 
        FROM movimientos m 
        left join clearings c on c.emisor_id = m.oficina_id 
        LEFT JOIN tipo_mov tm ON tm.id = m.tipo_mov_id 
        WHERE oficina_id = :oficina and m.producto_id = :producto and c.id = m.clearing_id and m.tipo_mov_id IN (4, 5)

        ORDER BY id asc;";

    $sth = $this->db->prepare($sql);

    $sth->bindParam("producto", $input['producto']);
    $sth->bindParam("oficina", $input['oficina']);
    $sth->execute();
    $prod = $sth->fetchAll();

    // update para corregir tipo de movimiento de la tabla movimientos que indica que es un clearing pero marca tipo_id = 2
    // UPDATE `movimientos` SET `tipo_mov_id` = '4' WHERE `movimientos`.`id` = 7060;
    // UPDATE `movimientos` SET `tipo_mov_id`= 4 WHERE `clearing_id` is not NULL and `tipo_mov_id` = 2

    // modificacion de la descripcion del ajuste
    // UPDATE `tipo_mov` SET `tipo_mov_descripcion` = 'Baja por rotura' WHERE `tipo_mov`.`id` = 12;
    // UPDATE `tipo_mov` SET `tipo_mov_descripcion` = 'Ajuste en negativo' WHERE `tipo_mov`.`id` = 14;

    // correccion de error en la tabla ajuste que no tienen asociado id de movimientos
    // insert into ajustes (fecha_ajuste, idmovimiento) select created, id from movimientos where id IN (SELECT m.id FROM `movimientos` m where m.tipo_mov_id in (12, 13, 6, 11) and m.id not in (select a.idmovimiento from ajustes a));



    $arrayAnioMesEgreso = array();
    $arrayAnioMesIngreso = array();

    $anios = array();
    $arrayAnio = array();

    foreach ($prod as $value) {

        //genero el array de egresos por mes y año   
        if ($value["suma"] != 1) {
            if ($value["anio"] && $value["mes"]) {
                //gusrdo los años en un array aux
                $arrayAnio[$value["anio"]] = $value["anio"];
                $mes =  "mes" . $value["mes"];
                if (isset($arrayAnioMesEgreso[$value["anio"]]) && isset($arrayAnioMesEgreso[$value["anio"]][$mes])) {
                    $aux = $arrayAnioMesEgreso[$value["anio"]][$mes];
                } else {
                    $aux = 0;
                }


                $arrayAnioMesEgreso[$value["anio"]]["mes0"] = $value["anio"];
                $arrayAnioMesEgreso[$value["anio"]][$mes] = $aux + $value["mov_cantidad"] * 1;
            }
        } else {
            //genero el array de ingresos por mes y año   
            if ($value["anio"] && $value["mes"]) {
                //gusrdo los años en un array aux
                $arrayAnio[$value["anio"]] = $value["anio"];
                $mes =  "mes" . $value["mes"];
                if (isset($arrayAnioMesIngreso[$value["anio"]]) && isset($arrayAnioMesIngreso[$value["anio"]][$mes])) {
                    $aux = $arrayAnioMesIngreso[$value["anio"]][$mes];
                } else {
                    $aux = 0;
                }


                $arrayAnioMesIngreso[$value["anio"]]["mes0"] = $value["anio"];
                $arrayAnioMesIngreso[$value["anio"]][$mes] = $aux + $value["mov_cantidad"] * 1;
            }
        }
    }


    //extraigo los años y genero un array
    $j = 0;
    foreach ($arrayAnio as $value) {

        $anios[$j] = $value;
        $j++;
    }

    $salida['anios'] = $anios;
    $salida['arrayAnioMesEgreso'] = $arrayAnioMesEgreso;
    $salida['arrayAnioMesIngreso'] = $arrayAnioMesIngreso;
    $salida['prod'] = $prod;


    return $this->response->withJson($salida);
});

$app->post('/DetalleMovimientoPorProducto', function ($request, $response, $args) {
    $input = $request->getParsedBody();
    $sql = "SELECT m.id as id, tm.tipo_mov_descripcion AS `tipo_mov_descripcion` FROM movimientos m
     LEFT JOIN tipo_mov tm ON tm.id = m.tipo_mov_id
                       WHERE m.id = :id;";
    $sth = $this->db->prepare($sql);


    $sth->bindParam("id", $input['id']);
    $sth->execute();
    $prod = $sth->fetchAll();
    return $this->response->withJson($prod);
});


$app->get('/productos/{oficina}', function ($request, $response, $args) {
    $oficina = $args['oficina'];
    $sth = $this->db->prepare("SELECT id, productos_codremediar, productos_barra, productos_descripcion
    FROM productos 
    WHERE productos.id IN (SELECT producto_id from productos_repo where oficina_id = :oficina)
    ORDER BY productos_descripcion;");
    $sth->bindParam("oficina", $oficina);

    $sth->execute();
    $todos = $sth->fetchAll();

    return $this->response->withJson($todos);
});
$app->get('/productos', function ($request, $response, $args) {
    $sth = $this->db->prepare("SELECT id, productos_codremediar, productos_barra, productos_descripcion
    FROM productos ORDER BY productos_descripcion;");

    $sth->execute();
    $todos = $sth->fetchAll();

    return $this->response->withJson($todos);
});

/** Obtención del producto buscandolo por id */
$app->get('/productoId/[{filtro}]', function ($request, $response, $args) {
    $sth = $this->db->prepare("SELECT * FROM productos WHERE id = :filtro;");

    $sth->bindParam("filtro", $args['filtro']);

    $sth->execute();
    $todos = $sth->fetchObject();

    return $this->response->withJson($todos);
});

$app->get('/productosStock/[{oficina}]', function ($request, $response, $args) {
    $oficina = $args['oficina'];
    $sth = $this->db->prepare("SELECT * FROM stockproductos
        WHERE oficina = :oficina ORDER BY productos_descripcion;");
    $sth->bindParam("oficina", $oficina);
    $sth->execute();
    $todos = $sth->fetchAll();
    return $this->response->withJson($todos);
});

$app->get(
    '/productosAll',
    function ($request, $response, $args) {
        $sth = $this->db->prepare("SELECT id, productos_codremediar, productos_barra, if(productos_codremediar != '',
                                concat(productos_descripcion,' (Remediar)'),`productos_descripcion`) AS `productos_descripcion`
                                FROM productos ORDER BY productos_descripcion;;");

        $sth->execute();
        $todos = $sth->fetchAll();

        return $this->response->withJson($todos);
    }
);

$app->get(
    '/productoRemediar/buscar/[{filtro}]',
    function ($request, $response, $args) {
        $sth = $this->db->prepare("SELECT id, productos_codremediar, productos_barra, productos_descripcion
    FROM productos WHERE productos_codremediar = :filtro
    ORDER BY productos_descripcion;");

        $sth->bindParam("filtro", $args['filtro']);
        $sth->execute();
        $todos = $sth->fetchAll();

        if (count($todos) == 0) {
            $sth = $this->db->prepare("SELECT id, productos_codremediar, productos_barra, productos_descripcion
        FROM productos WHERE productos_barra = :filtro
        ORDER BY productos_descripcion;");

            $filtroCorto = substr($args['filtro'], -3);

            $sth->bindParam("filtro", $filtroCorto);
            $sth->execute();
            $todos = $sth->fetchAll();

            if (count($todos) > 0) {
                $sth = $this->db->prepare("UPDATE productos SET productos_codremediar = :filtroReemplazo
                WHERE productos_barra = :filtro;");

                $sth->bindParam("filtroReemplazo", $args['filtro']);
                $sth->bindParam("filtro", $filtroCorto);
                $sth->execute();
            }
        }

        return $this->response->withJson($todos);
    }
);
$app->get(
    '/productoComun/buscar/[{filtro}]',
    function ($request, $response, $args) {
        $sth = $this->db->prepare("SELECT * FROM productos WHERE id IN(SELECT id_producto FROM productos_agrup
    WHERE cod_barra = :filtro);");

        $sth->bindParam("filtro", $args['filtro']);
        $sth->execute();
        $todos = $sth->fetchObject();

        return $this->response->withJson($todos);
    }
);

$app->get(
    '/productoLote/buscar/[{filtro}]',
    function ($request, $response, $args) {
        $sth = $this->db->prepare("SELECT id, lote_numero, lote_partida, lote_vencimiento, lote_remediar, producto_id, laboratorio_id
    FROM lotes WHERE producto_id = :filtro
    ORDER BY lote_vencimiento;");

        $sth->bindParam("filtro", $args['filtro']);
        $sth->execute();
        $todos = $sth->fetchAll();

        return $this->response->withJson($todos);
    }
);

$app->get(
    '/productoLote/buscarXOficina/{filtro}/{oficina}',
    function ($request, $response, $args) {
        $sth = $this->db->prepare("SELECT lote_id AS id, lote_numero, lote_partida, lote_vencimiento, lote_remediar, producto_id
                    FROM productocantidad_vw
                    WHERE lote_vencimiento > NOW() AND producto_id = :filtro AND oficina_id = :oficina
                    ORDER BY lote_vencimiento, lote_numero;");
        $sth->bindParam("filtro", $args['filtro']);
        $sth->bindParam("oficina", $args['oficina']);
        $sth->execute();
        $todos = $sth->fetchAll();

        return $this->response->withJson($todos);
    }
);

// $app->get('/producto/[{filtro}]', function ($request, $response, $args) {
//     $sth = $this->db->prepare("SELECT id, productos_codremediar, productos_barra, productos_descripcion
//             FROM productos WHERE productos_descripcion LIKE :filtro ORDER BY productos_descripcion;");

//     $filtro = "%" . $args['filtro'] . "%";
//     $sth->bindParam("filtro", $filtro);
//     $sth->execute();
//     $todos = $sth->fetchAll();
//     return $this->response->withJson($todos);
// });

$app->get('/producto/{filtro}/{oficina}', function ($request, $response, $args) {
    // $sth = $this->db->prepare("SELECT id, productos_codremediar, productos_barra, productos_descripcion
    //         FROM productos WHERE productos_descripcion LIKE :filtro ORDER BY productos_descripcion;");
    // $sth = $this->db->prepare("SELECT oficina_id, producto_id AS id, 
    //                                 CONCAT(productos_descripcion, ' | Stock: ', SUM(mov_cantidad * tipo_mov_suma)) AS productos_descripcion,
    //                                  SUM(mov_cantidad * tipo_mov_suma) AS cantidad
    //                             from movimientos m
    //                             left join tipo_mov tm ON m.tipo_mov_id = tm.id
    //                             left join productos p  ON p.id = m.producto_id
    //                             WHERE oficina_id = :oficina AND productos_descripcion LIKE :filtro
    //                             group by producto_id, oficina_id
    //                             order by productos_descripcion;");
    $sth = $this->db->prepare("SELECT m.oficina_id, m.producto_id AS id,
            CONCAT(productos_descripcion, ' | Stock: ', SUM(mov_cantidad * tipo_mov_suma)) AS productos_descripcion,
            SUM(mov_cantidad * tipo_mov_suma) AS cantidad
            from movimientos m
                inner join productos_repo pr ON pr.oficina_id = :oficina AND m.producto_id = pr.producto_id
                left join tipo_mov tm ON m.tipo_mov_id = tm.id
                left join productos p  ON p.id = m.producto_id
            WHERE m.oficina_id = :oficina AND productos_descripcion LIKE :filtro
            group by m.producto_id, m.oficina_id
            order by productos_descripcion;");

    $filtro = "%" . $args['filtro'] . "%";
    $sth->bindParam("filtro", $filtro);
    $sth->bindParam("oficina", $args['oficina']);
    $sth->execute();
    $todos = $sth->fetchAll();
    return $this->response->withJson($todos);
});

$app->get('/productoLote/{producto}/{oficina}', function ($request, $response, $args) {
    $sth = $this->db->prepare("SELECT * FROM `lotes` WHERE
                                id IN(Select lote_id FROM movimientos WHERE oficina_id = :oficina AND producto_id = :producto group by lote_id)
                                AND lote_vencimiento >= NOW();");
    $sth->bindParam("producto", $args['producto']);
    $sth->bindParam("oficina", $args['oficina']);
    $sth->execute();
    $todos = $sth->fetchAll();
    return $this->response->withJson($todos);
});


$app->get('/loteCantidad/{filtro}/{filtro1}', function ($request, $response, $args) {
    $sth = $this->db->prepare("SELECT lote_id, lote_vencimiento, stock,
    if(lote_remediar = 's', CONCAT(lote_numero,' (Remediar)'), lote_numero) AS lote_numero
    FROM productocantidad_completo_vw
    WHERE producto_id = :filtro AND oficina_id = :filtro1;");
    $sth->bindParam("filtro", $args['filtro']);
    $sth->bindParam("filtro1", $args['filtro1']);
    $sth->execute();
    $todos = $sth->fetchAll();
    return $this->response->withJson($todos);
});

$app->put('/postProductoEstablecimiento/{oficina}', function ($request, $response, $args) {
    $input = $request->getParsedBody();
    $oficina = $args['oficina'];

    $this->db->beginTransaction();

    $sth = $this->db->prepare("SELECT COUNT(*) as total FROM productos_repo WHERE producto_id = :producto_id AND oficina_id = :oficina;");
    $sth->bindParam("producto_id", $input['producto_id']);
    $sth->bindParam("oficina", $oficina);

    $sth->execute();

    $resultado = $sth->fetchObject();


    if ($resultado->total > 0) {
        $sth = $this->db->prepare("DELETE FROM productos_repo WHERE producto_id = :producto_id AND oficina_id = :oficina;");
        $sth->bindParam("producto_id", $input['producto_id']);
        $sth->bindParam("oficina", $oficina);
        if (!$sth->execute()) {
            $this->db->rollBack();
            $input['estado'] = 402;
            $input['error'] = 'Error al desvincular el producto.';
            $input['color'] = 'warn';
            return $this->response->withJson($input);
        } else {
            $this->db->commit();
            $input['estado'] = 201;
            $input['error'] = 'El producto se desvinculó correctamente.';
            $input['color'] = 'success';
            return $this->response->withJson($input);
        }
    } else {
        $sth = $this->db->prepare("INSERT INTO productos_repo (id, producto_id, productos_pto, productos_min, oficina_id)
            VALUE (NULL, :producto_id, 0, 0, :oficina );");
        $sth->bindParam("producto_id", $input['producto_id']);
        $sth->bindParam("oficina", $oficina);
        if (!$sth->execute()) {
            $this->db->rollBack();
            $input['estado'] = 402;
            $input['error'] = 'Error al grabar el producto.';
            $input['color'] = 'warn';
            return $this->response->withJson($input);
        } else {
            $this->db->commit();
            $input['estado'] = 201;
            $input['error'] = 'El producto se asocio correctamente.';
            $input['color'] = 'success';
            return $this->response->withJson($input);
        }
    }
});

$app->get('/getProductoEstablecimiento/{oficina}', function ($request, $response, $args) {
    $oficina = $args['oficina'];

    $sth = $this->db->prepare("SELECT p.id, p.productos_codremediar, p.productos_barra,
        p.productos_descripcion, oficina_id, if(producto_id IS NOT NULL, 'checked', 'false') AS pertenece
            FROM productos p
            LEFT JOIN productos_repo pr ON pr.producto_id = p.id AND oficina_id = :oficina;");
    $sth->bindParam("oficina", $oficina);
    $sth->execute();
    $resultado = $sth->fetchAll();
    return $this->response->withJson($resultado);
});

// este endpoint requiere que se le pase el id de producto para guardar en la tabla movimientos
$app->put('/ajusteCantidad/{oficina}', function ($request, $response, $args) {
    $input = $request->getParsedBody();
    $oficina = $args['oficina'];

    $this->db->beginTransaction();
    $resultado = 0;
    $sth = $this->db->prepare("INSERT INTO movimientos (mov_cantidad, lote_id, tipo_mov_id, oficina_id, producto_id)
        VALUE (:cantidad, :lote, :tipo_mov_id, :oficina, :producto );");
    $sth->bindParam("lote", $input['lote']);
    $sth->bindParam("cantidad", $input['cantidad']);
    $sth->bindParam("tipo_mov_id", $input['tipo_mov_id']);
    $sth->bindParam("producto", $input['producto']["id"]);
    $sth->bindParam("oficina", $oficina);

    if (!$sth->execute()) {
        $input['estado'] = 402;
        $input['error'] = 'Error al grabar el producto.';
        return $this->response->withJson($input);
    }

    $input['id'] = $this->db->lastInsertId();
    $sth = $this->db->prepare("INSERT INTO ajustes (fecha_ajuste, idmovimiento, motivo)
    VALUE (NOW(), :idmovimiento, :descripcion);");

    $sth->bindParam("idmovimiento", $input['id']);
    $sth->bindParam("descripcion", $input['descripcion']);


    if (!$sth->execute()) {
        $this->db->rollBack();
        $resultado = false;
    } else {
        $this->db->commit();
        $resultado = true;
    }
    return $this->response->withJson($resultado);
});

$app->group('/api', function (\Slim\App $app) {
    // $app->get('/producto/[{filtro}]', function ($request, $response, $args) {
    //     $sth = $this->db->prepare("SELECT id, productos_codremediar, productos_barra, productos_descripcion
    // FROM productos WHERE productos_descripcion LIKE :filtro ORDER BY productos_descripcion;");

    //     $filtro = "%" . $args['filtro'] . "%";
    //     $sth->bindParam("filtro", $filtro);
    //     $sth->execute();
    //     $todos = $sth->fetchAll();
    //     return $this->response->withJson($todos);
    // });

    // $app->post('/ajusteCantidad', function ($request, $response, $args) {
    //     $input = $request->getParsedBody();

    //     $nn = json_decode($input['json']);

    //     $this->db->beginTransaction();
    //     $resultado = 0;
    //     foreach ($nn as $key => $value) {

    //         $sth = $this->db->prepare("INSERT INTO movimientos (mov_cantidad, lote_id, tipo_mov_id, oficina_id)
    //         VALUE (:cantidad, :lote, :tipo_mov_id, :oficina );");
    //         $sth->bindParam("lote", $value->lote->id);
    //         $sth->bindParam("cantidad", $value->cantidad);
    //         $sth->bindParam("tipo_mov_id", $value->tipo_mov_id);
    //         $sth->bindParam("oficina", $input['oficina']);

    //         if (!$sth->execute()) {
    //             $resultado++;
    //         }
    //     }
    //     if ($resultado > 0) {
    //         $this->db->rollBack();
    //         $resultado = false;
    //     } else {
    //         $this->db->commit();
    //         $resultado = true;
    //     }
    //     return $this->response->withJson($resultado);
    // });
});
