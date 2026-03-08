<?php

namespace App\Http\Controllers;

use App\Models\Vezba;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class VezbaController extends Controller
{
    #[OA\Post(
        path: "/api/vezbe",
        summary: "Kreiranje nove vežbe",
        tags: ["Vežbe"],
        security: [["sanctum" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["ime", "snimak"],
                properties: [
                    new OA\Property(property: "ime", type: "string", example: "Čučanj"),
                    new OA\Property(property: "snimak", type: "string", format: "url", example: "https://youtube.com/watch?v=123"),
                    new OA\Property(property: "kategorija", type: "string", example: "Noge", nullable: true)
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Vežba uspešno kreirana"),
            new OA\Response(response: 422, description: "Validaciona greška")
        ]
    )]
    public function store(Request $request)
    {
        $request->validate([
            'ime' => 'required|string|max:255',
            'snimak' => 'required|url',
            'kategorija' => 'nullable|string',
        ]);

        return Vezba::create([
            'ime' => $request->ime,
            'snimak' => $request->snimak,
            'kategorija' => $request->kategorija,
        ]);
    }

    #[OA\Get(
        path: "/api/vezbe",
        summary: "Prikaz svih vežbi",
        tags: ["Vežbe"],
        security: [["sanctum" => []]],
        responses: [
            new OA\Response(response: 200, description: "Lista svih vežbi")
        ]
    )]
    public function index()
    {
        return Vezba::all();
    }
}