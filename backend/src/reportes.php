<?php
// $app->group('', function (\Slim\App $app) {
// $app->group('', function (\Slim\App $app) {
//     $app->get('/stocktodoslosproductos/[{oficina}]', function ($request, $response, $args) {
//         $oficina = $args['oficina'];
//         $sth = $this->db->prepare("SELECT * FROM stocktodoslosproductos_nuevo
//             WHERE oficina = :oficina ORDER BY productos_descripcion;");
//         $sth->bindParam("oficina", $oficina);
//         $sth->execute();
//         $todos = $sth->fetchAll();
//         return $this->response->withJson($todos);
//     });
// });
// // ->add($a);

$app->get(
    '/ventasPorDia/{fecha}',
    function ($request, $response, $args) {
        $sth = $this->db->prepare("SELECT numero, fecha, estado, precio, cantidad, descuento, codigo, descripcion, u.nombre AS usuario
                FROM `presupuesto` p
                LEFT JOIN producto_presupuesto pp ON pp.idpresupuesto = p.idpresupuesto
                LEFT JOIN productos pr ON pr.idproducto = pp.idproducto
                LEFT JOIN productos_meta pm ON pm.id = pr.idproductometa
                LEFT JOIN users u ON u.id = p.usuario
                WHERE fecha = :fecha;");

        $sth->bindParam("fecha", $args['fecha']);
        $sth->execute();
        $todos = $sth->fetchAll();
        return $this->response->withJson($todos);
    }
);
$app->post(
    '/buscarInfMensualMonto',
    function ($request, $response, $args) {
        $input = $request->getParsedBody();
        $mes = intval($input['mes']) < 10 ? '0' . $input['mes'] : $input['mes'];
        $anio = intval($input['anio']);
        $sth = $this->db->prepare("SELECT SUM(precio) AS precio, fecha
                    FROM `producto_presupuesto` pp
                    LEFT JOIN presupuesto p ON p.idpresupuesto = pp.idpresupuesto
                    WHERE date_format(p.fecha, '%Y') = :anio AND DATE_FORMAT(p.fecha, '%m') = :mes
                    GROUP BY fecha;");
        $sth->bindParam("mes", $mes);
        $sth->bindParam("anio", $anio);

        $sth->execute();
        $todos = $sth->fetchAll();
        return $this->response->withJson($todos);
    }
);
