<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Podaci;
use OpenApi\Attributes as OA;

class PodaciController extends Controller
{
    #[OA\Post(
        path: "/api/podaci",
        summary: "Unos podataka za određenu vežbu",
        description: "Beleži rezultate izvedene vežbe poput serija, ponavljanja, težine i pulsa (BPM).",
        tags: ["Podaci o vežbanju"],
        security: [["sanctum" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["vezba_id"],
                properties: [
                    new OA\Property(property: "vezba_id", type: "integer", example: 1),
                    new OA\Property(property: "trajanje", type: "integer", nullable: true, example: 60, description: "Trajanje u sekundama"),
                    new OA\Property(property: "serija", type: "integer", nullable: true, example: 3),
                    new OA\Property(property: "ponavljanja", type: "integer", nullable: true, example: 12),
                    new OA\Property(property: "tezina", type: "number", format: "float", nullable: true, example: 52.5),
                    new OA\Property(property: "bpm", type: "integer", nullable: true, example: 135)
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Podaci uspešno kreirani"),
            new OA\Response(response: 422, description: "Greška u validaciji")
        ]
    )]
    public function store(Request $request)
    {
        $request->validate([
            'vezba_id' => 'required|integer|exists:vezbas,id',
            'trajanje' => 'nullable|integer|min:0',
            'serija' => 'nullable|integer|min:0',
            'ponavljanja' => 'nullable|integer|min:0',
            'tezina' => 'nullable|numeric|min:0',
            'bpm' => 'nullable|integer|min:0',
        ]);

        $podaci = Podaci::create([
            'vezba_id' => $request->vezba_id,
            'trajanje' => $request->trajanje,
            'serija' => $request->serija,
            'ponavljanja' => $request->ponavljanja,
            'tezina' => $request->tezina,
            'bpm' => $request->bpm
        ]);

        return response()->json($podaci, 201);
    }

    #[OA\Put(
        path: "/api/podaci/{id}",
        summary: "Ažuriranje postojećih podataka o vežbi",
        tags: ["Podaci o vežbanju"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        requestBody: new OA\RequestBody(
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "trajanje", type: "integer"),
                    new OA\Property(property: "serija", type: "integer"),
                    new OA\Property(property: "ponavljanja", type: "integer"),
                    new OA\Property(property: "tezina", type: "number"),
                    new OA\Property(property: "bpm", type: "integer")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Uspešno ažurirano"),
            new OA\Response(response: 404, description: "Podaci nisu pronađeni")
        ]
    )]
    public function update(Request $request, $id)
    {
        $podaci = Podaci::findOrFail($id);

        $request->validate([
            'trajanje' => 'nullable|integer|min:0',
            'serija' => 'nullable|integer|min:0',
            'ponavljanja' => 'nullable|integer|min:0',
            'tezina' => 'nullable|numeric|min:0',
            'bpm' => 'nullable|integer|min:0',
        ]);

        $podaci->update($request->only(['trajanje','serija','ponavljanja','tezina','bpm']));

        return response()->json($podaci);
    }
}