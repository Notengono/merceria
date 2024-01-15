
<?php
// <!-- 2023 12 14
// ALTER TABLE `merceria`.`productos` ADD COLUMN `codigo` VARCHAR(15) NOT NULL DEFAULT '' AFTER `idproducto`; -->
$app->post(
    '/productos',
    function ($request, $response, $args) {
        $input = $request->getParsedBody();
        if (
            $input['inputGroupCategoria'] != 0 &&
            $input['inputGroupSubCategoria'] != 0
        ) {
            $sth = $this->db->prepare("SELECT p.idproducto, p.codigo, p.idgrupo, p.idsubgrupo, idproductometa, p.idprecio, precio, pm.descripcion AS producto,
                        sg.descripcion AS subgrupo, g.descripcion AS grupo
                        FROM `productos` p
                        LEFT JOIN `productos_meta` pm on p.idproductometa = pm.id
                        LEFT JOIN `precios` pr ON pr.idprecio = p.idprecio
                        LEFT JOIN `subgrupos` sg on p.idsubgrupo = sg.idsubgrupo
                        LEFT JOIN `grupos` g on p.idgrupo = g.idgrupo WHERE p.idgrupo = :idgrupo AND p.idsubgrupo =  :idsubgrupo 
                        ORDER BY pm.descripcion");
            $sth->bindParam("idgrupo", $input['inputGroupCategoria']);
            $sth->bindParam("idsubgrupo", $input['inputGroupSubCategoria']);
        } elseif (
            $input['inputGroupCategoria'] != 0 &&
            $input['inputGroupSubCategoria'] == 0
        ) {
            $sth = $this->db->prepare("SELECT p.idproducto, p.codigo, p.idgrupo, p.idsubgrupo, idproductometa, p.idprecio, precio, pm.descripcion AS producto,
                        sg.descripcion AS subgrupo, g.descripcion AS grupo
                        FROM `productos` p
                        LEFT JOIN `productos_meta` pm on p.idproductometa = pm.id
                        LEFT JOIN `precios` pr ON pr.idprecio = p.idprecio
                        LEFT JOIN `subgrupos` sg on p.idsubgrupo = sg.idsubgrupo
                        LEFT JOIN `grupos` g on p.idgrupo = g.idgrupo WHERE p.idgrupo = :idgrupo
                        ORDER BY pm.descripcion");
            $sth->bindParam("idgrupo", $input['inputGroupCategoria']);
        } elseif (
            $input['inputGroupCategoria'] == 0 &&
            $input['inputGroupSubCategoria'] == 0
        ) {
            $sth = $this->db->prepare("SELECT p.idproducto, p.codigo, p.idgrupo, p.idsubgrupo, idproductometa, p.idprecio, precio, pm.descripcion AS producto,
                        sg.descripcion AS subgrupo, g.descripcion AS grupo
                        FROM `productos` p
                        LEFT JOIN `productos_meta` pm on p.idproductometa = pm.id
                        LEFT JOIN `precios` pr ON pr.idprecio = p.idprecio
                        LEFT JOIN `subgrupos` sg on p.idsubgrupo = sg.idsubgrupo
                        LEFT JOIN `grupos` g on p.idgrupo = g.idgrupo ORDER BY pm.descripcion");
        };

        $sth->execute();
        $resultado = $sth->fetchAll();

        if (intval(count($resultado)) == 0) {
            $input['resultado'] = false;
            $input['estado'] = 404;
            $input['error'] = 'No se encontraron resultados.';
        } else {
            $input['resultado'] = $resultado;
            $input['estado'] = 200;
            $input['error'] = 'Se encontraron ' . strval(count($resultado)) . ' resultados.';
        }

        // return $this->response->withJson($input)->withStatus($input['estado']);
        return $this->response->withJson($resultado)->withJson($input)->withStatus($input['estado']);
    }
);
$app->post(
    '/producto',
    function ($request, $response, $args) {
        $input = $request->getParsedBody();
        // Descripción y precio van en tablas separadas, obtengo los id de lo almacenado y luego grabo en productos.
        try {
            $this->db->beginTransaction();
            $sth = $this->db->prepare("INSERT INTO productos_meta (descripcion) VALUES(:descripcion);");
            $sth->bindParam("descripcion", $input['descripcion']);

            $sth->execute();
            $idpm = $this->db->lastInsertId();

            $sth = $this->db->prepare("INSERT INTO precios (precio, vigente) VALUES(:precio, 1);");
            $input['precio'] = $input['precio'] === NULL ? 0 : $input['precio'];
            $sth->bindParam("precio", $input['precio']);

            $sth->execute();
            $idprecio = $this->db->lastInsertId();

            $sth = $this->db->prepare("INSERT INTO productos (codigo, idgrupo, idsubgrupo, idproductometa, idprecio)
                                        VALUES(:codigo, :inputGroupCategoria, :inputGroupSubCategoria, :idproductometa, :idprecio);");
            $sth->bindParam("codigo", $input['codigo']);
            $sth->bindParam("inputGroupCategoria", $input['inputGroupCategoria']);
            $sth->bindParam("inputGroupSubCategoria", $input['inputGroupSubCategoria']);
            $sth->bindParam("idproductometa", $idpm);
            $sth->bindParam("idprecio", $idprecio);

            if (!$sth->execute()) {
                $this->db->rollBack();
                $input['estado'] = 402;
                $input['error'] = 'Error al grabar el registro.';
                return $this->response->withJson($input);
            } else {
                $this->db->commit();
                $input['id'] = $this->db->lastInsertId();
                $input['estado'] = 200;
                $input['error'] = 'El registro se almacenó correctamente.';
            }
            return $this->response->withJson($input);
        } catch (\Throwable $th) {
            $input['estado'] = 402;
            $input['error'] = 'Error al grabar el registro.';
            return $this->response->withJson($input);
        }
    }
);
$app->get(
    '/producto/{id}',
    function ($request, $response, $args) {
        // Descripción y precio van en tablas separadas, obtengo los id de lo almacenado y luego grabo en productos.
        try {
            $id = $args['id'];
            $sth = $this->db->prepare("SELECT * FROM productos WHERE idproducto = :id;");
            $sth->bindParam("id", $id);

            if (!$sth->execute()) {
                $input['estado'] = 402;
                $input['error'] = 'Error al buscar el producto.';
                return $this->response->withJson($input);
            } else {
                $input['datos'] = $sth->fetchObject();;
                $input['estado'] = 200;
                $input['error'] = 'El registro se encontró.';
            }
            return $this->response->withJson($input);
        } catch (\Throwable $th) {
            $input['estado'] = 402;
            $input['error'] = 'Error al buscar el registro.' . $th;
            return $this->response->withJson($input);
        }
    }
);
$app->get(
    '/getProdutoMeta/{id}',
    function ($request, $response, $args) {
        try {
            $id = $args['id'];
            $sth = $this->db->prepare("SELECT * FROM productos_meta WHERE id = :id;");
            $sth->bindParam("id", $id);

            if (!$sth->execute()) {
                $input['estado'] = 402;
                $input['error'] = 'Error al buscar el producto.';
                return $this->response->withJson($input);
            } else {
                $input['datos'] = $sth->fetchObject();;
                $input['estado'] = 200;
                $input['error'] = 'El registro se encontró.';
            }
            return $this->response->withJson($input);
        } catch (\Throwable $th) {
            $input['estado'] = 402;
            $input['error'] = 'Error al buscar el registro.' . $th;
            return $this->response->withJson($input);
        }
    }
);

$app->get(
    '/getPrecios/{id}',
    function ($request, $response, $args) {
        try {
            $id = $args['id'];
            $sth = $this->db->prepare("SELECT * FROM precios WHERE idprecio = :id;");
            $sth->bindParam("id", $id);

            if (!$sth->execute()) {
                $input['estado'] = 402;
                $input['error'] = 'Error al buscar el producto.';
                return $this->response->withJson($input);
            } else {
                $input['datos'] = $sth->fetchObject();;
                $input['estado'] = 200;
                $input['error'] = 'El registro se encontró.';
            }
            return $this->response->withJson($input);
        } catch (\Throwable $th) {
            $input['estado'] = 402;
            $input['error'] = 'Error al buscar el registro.' . $th;
            return $this->response->withJson($input);
        }
    }
);

$app->post(
    '/postNuevoPrecio',
    function ($request, $response, $args) {
        $input = $request->getParsedBody();
        try {
            foreach ($input['valor2'] as $key => $value) {

                $sth = $this->db->prepare("SELECT (precio * :valor1) AS precio FROM `precios` WHERE idprecio = :idprecio;");
                $sth->bindParam("valor1", $input['valor1']);
                $sth->bindParam("idprecio", $value);

                $sth->execute();
                $precio = $sth->fetchObject();

                $sth = $this->db->prepare("UPDATE precios SET vigente = 2 WHERE idprecio = :idprecio;");
                $sth->bindParam("idprecio", $value);
                $sth->execute();

                $sth = $this->db->prepare("INSERT INTO precios (precio, vigente) VALUES(:precio, 1);");
                $sth->bindParam("precio", $precio->precio);
                $sth->execute();
                $idprecio = $this->db->lastInsertId();

                $sth = $this->db->prepare("UPDATE productos SET idprecio = :idprecion WHERE idprecio = :idpreciov;");
                $sth->bindParam("idprecion", $idprecio);
                $sth->bindParam("idpreciov", $value);
                $sth->execute();
            }

            $input['estado'] = 200;
            $input['error'] = 'El registro se almacenó correctamente.';
            return $this->response->withJson($input);
        } catch (\Throwable $th) {
            $input['estado'] = 402;
            $input['error'] = 'Error al grabar el registro.';
            return $this->response->withJson($th);
        }
    }
);


$app->put(
    '/producto',
    function ($request, $response, $args) {
        $input = $request->getParsedBody();
        // Descripción y precio van en tablas separadas, obtengo los id de lo almacenado y luego grabo en productos.
        try {
            $this->db->beginTransaction();
            $sth = $this->db->prepare("INSERT INTO productos_meta (descripcion) VALUES(:descripcion);");
            $sth->bindParam("descripcion", $input['descripcion']);

            $sth->execute();
            $idpm = $this->db->lastInsertId();

            $sth = $this->db->prepare("INSERT INTO precios (precio, vigente) VALUES(:precio, 1);");
            $sth->bindParam("precio", $input['precio']);

            $sth->execute();
            $idprecio = $this->db->lastInsertId();

            $sth = $this->db->prepare("UPDATE productos SET codigo = :codigo, idgrupo = :inputGroupCategoria,
                         idsubgrupo = :inputGroupSubCategoria, idproductometa = :idproductometa, idprecio = :idprecio
                         WHERE idproducto = :id;");
            $sth->bindParam("codigo", $input['codigo']);
            $sth->bindParam("inputGroupCategoria", $input['inputGroupCategoria']);
            $sth->bindParam("inputGroupSubCategoria", $input['inputGroupSubCategoria']);
            $sth->bindParam("idproductometa", $idpm);
            $sth->bindParam("idprecio", $idprecio);
            $sth->bindParam("id", $input['idproducto']);

            if (!$sth->execute()) {
                $this->db->rollBack();
                $input['estado'] = 402;
                $input['error'] = 'Error al grabar el registro.';
                return $this->response->withJson($input);
            } else {
                $this->db->commit();
                $input['id'] = $this->db->lastInsertId();
                $input['estado'] = 200;
                $input['error'] = 'El registro se actualizó correctamente.';
            }
            return $this->response->withJson($input);
        } catch (\Throwable $th) {
            $this->db->rollBack();
            $input['estado'] = 402;
            $input['error'] = 'Error al grabar el registro.';
            return $this->response->withJson($input);
        }
    }
);




// $app->put('/postProductoEstablecimiento/{oficina}', function ($request, $response, $args) {
//     $input = $request->getParsedBody();
//     $oficina = $args['oficina'];

//     $this->db->beginTransaction();

//     $sth = $this->db->prepare("SELECT COUNT(*) as total FROM productos_repo WHERE producto_id = :producto_id AND oficina_id = :oficina;");
//     $sth->bindParam("producto_id", $input['producto_id']);
//     $sth->bindParam("oficina", $oficina);

//     $sth->execute();

//     $resultado = $sth->fetchObject();


//     if ($resultado->total > 0) {
//         $sth = $this->db->prepare("DELETE FROM productos_repo WHERE producto_id = :producto_id AND oficina_id = :oficina;");
//         $sth->bindParam("producto_id", $input['producto_id']);
//         $sth->bindParam("oficina", $oficina);
//         if (!$sth->execute()) {
//             $this->db->rollBack();
//             $input['estado'] = 402;
//             $input['error'] = 'Error al desvincular el producto.';
//             $input['color'] = 'warn';
//             return $this->response->withJson($input);
//         } else {
//             $this->db->commit();
//             $input['estado'] = 201;
//             $input['error'] = 'El producto se desvinculó correctamente.';
//             $input['color'] = 'success';
//             return $this->response->withJson($input);
//         }
//     } else {
//         $sth = $this->db->prepare("INSERT INTO productos_repo (id, producto_id, productos_pto, productos_min, oficina_id)
//             VALUE (NULL, :producto_id, 0, 0, :oficina );");
//         $sth->bindParam("producto_id", $input['producto_id']);
//         $sth->bindParam("oficina", $oficina);
//         if (!$sth->execute()) {
//             $this->db->rollBack();
//             $input['estado'] = 402;
//             $input['error'] = 'Error al grabar el producto.';
//             $input['color'] = 'warn';
//             return $this->response->withJson($input);
//         } else {
//             $this->db->commit();
//             $input['estado'] = 201;
//             $input['error'] = 'El producto se asocio correctamente.';
//             $input['color'] = 'success';
//             return $this->response->withJson($input);
//         }
//     }
// });

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
