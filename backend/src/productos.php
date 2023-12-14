
<?php
// <!-- 2023 12 14
// ALTER TABLE `merceria`.`productos` ADD COLUMN `codigo` VARCHAR(15) NOT NULL DEFAULT '' AFTER `idproducto`; -->
$app->post(
    '/productos',
    function ($request, $response, $args) {
        $input = $request->getParsedBody();
        // $sth = $this->db->prepare("SELECT * From productos WHERE idgrupo = :idgrupo AND idsubgrupo =  :idsubgrupo");
        $sth = $this->db->prepare("SELECT p.idproducto, p.codigo, p.idgrupo, p.idsubgrupo, idproductometa, idprecio, pm.descripcion AS producto,
                    sg.descripcion AS subgrupo, g.descripcion AS grupo
                    FROM `productos` p
                    LEFT JOIN `productos_meta` pm on p.idproductometa = pm.id
                    LEFT JOIN `subgrupos` sg on p.idsubgrupo = sg.idsubgrupo
                    LEFT JOIN `grupos` g on p.idgrupo = g.idgrupo WHERE p.idgrupo = :idgrupo AND p.idsubgrupo =  :idsubgrupo 
                    ORDER BY pm.descripcion");
        $sth->bindParam("idgrupo", $input['inputGroupCategoria']);
        $sth->bindParam("idsubgrupo", $input['inputGroupSubCategoria']);
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
