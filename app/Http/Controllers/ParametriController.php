<?php

namespace App\Http\Controllers;

use App\Models\Parametri;
use App\Http\Requests\StoreParametriRequest;
use App\Http\Requests\UpdateParametriRequest;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class ParametriController extends Controller
{
    #[OA\Get(
        path: "/api/parametri",
        summary: "Prikaz liste parametara ulogovanog korisnika",
        tags: ["Parametri"],
        security: [["sanctum" => []]],
        responses: [
            new OA\Response(response: 200, description: "Uspešno vraćeni parametri"),
            new OA\Response(response: 401, description: "Niste ulogovani")
        ]
    )]
    public function index()
    {
        // Napomena: U tvom originalnom kodu nedostaje Request $request u argumentima funkcije, 
        // ali koristim auth() da bi radilo bezbedno ako se ne menja potpis.
        $parametri = Parametri::where('user_id', auth()->id())
                        ->orderBy('date', 'desc')
                        ->get();

        return response()->json($parametri);
    }

    #[OA\Get(
        path: "/api/all-parametri",
        summary: "Dobijanje svih parametara korisnika preko relacije",
        tags: ["Parametri"],
        security: [["sanctum" => []]],
        responses: [new OA\Response(response: 200, description: "OK")]
    )]
    public function allParametri()
    {
        $parametri = auth()->user()->parametri()->orderByDesc('date')->get();
        return response()->json($parametri);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    #[OA\Post(
        path: "/api/parametri",
        summary: "Snimanje novih telesnih parametara",
        description: "Kreira novi unos parametara i automatski računa BMI.",
        tags: ["Parametri"],
        security: [["sanctum" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["date", "tezina", "visina", "masti", "misici", "obim_struka"],
                properties: [
                    new OA\Property(property: "date", type: "string", format: "date", example: "2026-03-08"),
                    new OA\Property(property: "tezina", type: "number", example: 85.5),
                    new OA\Property(property: "visina", type: "number", example: 185),
                    new OA\Property(property: "masti", type: "number", example: 15.2),
                    new OA\Property(property: "misici", type: "number", example: 40.1),
                    new OA\Property(property: "obim_struka", type: "number", example: 90)
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Parametri uspešno sačuvani"),
            new OA\Response(response: 422, description: "Validaciona greška")
        ]
    )]
    public function store(StoreParametriRequest $request)
    {
        $validated = $request->validate([
                'date' => 'required|date',
                'tezina' => 'required|numeric',
                'visina' => 'required|numeric',
                'masti' => 'required|numeric',
                'misici' => 'required|numeric',
                'obim_struka' => 'required|numeric',
            ]);

        $visinaUMetrima = $validated['visina'] / 100;
        $bmi = $validated['tezina'] / ($visinaUMetrima * $visinaUMetrima);

        $parametri = Parametri::create([
            'user_id' => auth()->id(),
            'date' => $validated['date'],
            'tezina' => $validated['tezina'],
            'visina' => $validated['visina'],
            'bmi' => round($bmi, 2),
            'masti' => $validated['masti'],
            'misici' => $validated['misici'],
            'obim_struka' => $validated['obim_struka'],
        ]);

        return response()->json([
            'message' => 'Parametri uspešno sačuvani',
            'parametri' => $parametri
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Parametri $parametri)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Parametri $parametri)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateParametriRequest $request, Parametri $parametri)
    {
        //
    }

    #[OA\Delete(
        path: "/api/parametar/{id}",
        summary: "Brisanje određenog parametra",
        tags: ["Parametri"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Obrisano"),
            new OA\Response(response: 404, description: "Nije pronađeno")
        ]
    )]
    public function destroy($id)
    {
        $parametar = Parametri::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $parametar->delete();

        return response()->json([
            'message' => 'Parametar uspešno obrisan'
        ]);
    }
}