<?php

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: "1.0.0",
    title: "Fitnes Planer API",
    description: "Dokumentacija koristeći PHP Atribute"
)]
#[OA\Server(
    url: "http://localhost:8000/api",
    description: "Lokalni API server"
)]
abstract class Controller
{
    #[OA\Get(
        path: "/test-ruta",
        summary: "Provera rada preko Atributa",
        responses: [
            new OA\Response(
                response: 200,
                description: "Sve radi savršeno!"
            )
        ]
    )]
    public function test() {}
    
}
