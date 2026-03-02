<?php

namespace App\Http\Controllers;

use App\Models\Vezba;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA; // Promenjeno u Attributes

class VezbaController extends Controller
{
    #[OA\Get(
        path: '/api/vezbe',
        summary: 'Lista svih vežbi',
        tags: ['Vezbe'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Lista vežbi',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(
                        properties: [
                            new OA\Property(property: 'id', type: 'integer', example: 1),
                            new OA\Property(property: 'ime', type: 'string', example: 'Čučnjevi'),
                            new OA\Property(property: 'snimak', type: 'string', example: 'https://linkdosnimka.com'),
                            new OA\Property(property: 'kategorija', type: 'string', example: 'noge')
                        ]
                    )
                )
            )
        ]
    )]
    public function index()
    {
        return Vezba::all();
    }

    #[OA\Post(
        path: '/api/vezbe',
        summary: 'Dodavanje vežbe',
        tags: ['Vezbe'],
        security: [['sanctum' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['ime', 'snimak'],
                properties: [
                    new OA\Property(property: 'ime', type: 'string', example: 'Čučnjevi'),
                    new OA\Property(property: 'snimak', type: 'string', example: 'https://linkdosnimka.com'),
                    new OA\Property(property: 'kategorija', type: 'string', example: 'noge')
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Vežba uspešno dodata'
            )
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
}