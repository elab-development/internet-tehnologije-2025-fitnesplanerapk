<?php

namespace App\Http\Controllers;
use OpenApi\Attributes as OA; // VAŽNO: Attributes, a ne Annotations

#[OA\Info(
    title: "Fitnes Planer API",
    version: "1.0.0",
    description: "API dokumentacija za aplikaciju Fitnes Planer"
)]
#[OA\Server(
    url: "http://localhost:8000",
    description: "Lokalni razvojni server"
)]
#[OA\SecurityScheme(
    securityScheme: "sanctum",
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT"
)]
abstract class Controller
{
    //
}
