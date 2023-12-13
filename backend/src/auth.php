<?php

use Firebase\JWT\JWT;
use Firebase\JWT\ExpiredException;

$app->get(
    '/logedIn',
    function ($request, $response, $args) {
        $settings = $this->get('settings');
        $params = $request->getServerParams();
        $authorization = $params['HTTP_AUTHORIZATION'];
        $authorization = explode(' ', $authorization);
        $jwt = $authorization[1];

        try {
            JWT::decode($jwt, $settings["jwt"]["secret"], array('HS256'));
            return $response->withJson(true);
        } catch (ExpiredException $e) {
            return $response->withJson(false);
        }
    }
);
