<?php

namespace App\Http\Controllers;

use App\Models\Parametri;
use App\Http\Requests\StoreParametriRequest;
use App\Http\Requests\UpdateParametriRequest;
use OpenApi\Annotations as OA; 
class ParametriController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/parametri",
     *     summary="Prikaz trenutnih parametara korisnika",
     *     tags={"Parametri"},
     *     security={{"sanctum":{}}},
     *     @OA\Response(response=200, description="Trenutni parametri korisnika")
     * )
     */
    public function index()
    {
        $parametri = Parametri::where('user_id', auth()->id())
                        ->orderBy('date', 'desc')
                        ->get();

        return response()->json($parametri);
    }

    /**
     * @OA\Get(
     *     path="/api/parametri/all",
     *     summary="Prikaz svih parametara korisnika",
     *     tags={"Parametri"},
     *     security={{"sanctum":{}}},
     *     @OA\Response(response=200, description="Lista svih parametara korisnika")
     * )
     */
    public function allParametri()
    {
        $parametri = auth()->user()->parametri()->orderByDesc('date')->get();
        return response()->json($parametri);
    }

    /**
     * @OA\Post(
     *     path="/api/parametri",
     *     summary="Dodavanje parametara korisnika",
     *     tags={"Parametri"},
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"date","tezina","visina","masti","misici","obim_struka"},
     *             @OA\Property(property="date", type="string", format="date", example="2026-03-01"),
     *             @OA\Property(property="tezina", type="number", example=70),
     *             @OA\Property(property="visina", type="number", example=175),
     *             @OA\Property(property="masti", type="number", example=15),
     *             @OA\Property(property="misici", type="number", example=40),
     *             @OA\Property(property="obim_struka", type="number", example=80)
     *         )
     *     ),
     *     @OA\Response(response=201, description="Parametri uspešno dodati")
     * )
     */
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
     * @OA\Get(
     *     path="/api/parametri/{id}",
     *     summary="Prikaz jednog parametra",
     *     tags={"Parametri"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Prikaz jednog parametra korisnika")
     * )
     */
    public function show(Parametri $parametri)
    {
        return response()->json($parametri);
    }

    /**
     * @OA\Put(
     *     path="/api/parametri/{id}",
     *     summary="Izmena parametara korisnika",
     *     tags={"Parametri"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="date", type="string", format="date", example="2026-03-01"),
     *             @OA\Property(property="tezina", type="number", example=72),
     *             @OA\Property(property="visina", type="number", example=175),
     *             @OA\Property(property="masti", type="number", example=16),
     *             @OA\Property(property="misici", type="number", example=41),
     *             @OA\Property(property="obim_struka", type="number", example=81)
     *         )
     *     ),
     *     @OA\Response(response=200, description="Parametri uspešno izmenjeni")
     * )
     */
    public function update(UpdateParametriRequest $request, Parametri $parametri)
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

        $parametri->update([
            'date' => $validated['date'],
            'tezina' => $validated['tezina'],
            'visina' => $validated['visina'],
            'bmi' => round($bmi, 2),
            'masti' => $validated['masti'],
            'misici' => $validated['misici'],
            'obim_struka' => $validated['obim_struka'],
        ]);

        return response()->json([
            'message' => 'Parametri uspešno izmenjeni',
            'parametri' => $parametri
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/parametri/{id}",
     *     summary="Brisanje parametra",
     *     tags={"Parametri"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Parametar uspešno obrisan")
     * )
     */
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

    /**
     * Show the form for creating a new resource.
     */
    public function create()
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
}