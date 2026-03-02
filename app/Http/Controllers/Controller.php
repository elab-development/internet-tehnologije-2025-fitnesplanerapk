<?php

namespace App\Http\Controllers;

/**
 * @OA\Info(
 * version="1.0.0",
 * title="Fitnes API Test",
 * description="Test generisanja"
 * )
 *
 * @OA\Server(
 * url="http://localhost:8000/api",
 * description="Lokalni server"
 * )
 */
abstract class Controller
{
    /**
     * @OA\Get(
     * path="/test-ruta",
     * summary="Samo za test",
     * @OA\Response(response=200, description="Radi")
     * )
     */
    public function test() {}
}
