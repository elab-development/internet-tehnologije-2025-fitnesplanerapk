<?php

namespace App\Http\Controllers;

use App\Models\Vezba;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA; 
class VezbaController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/vezbe",
     *     summary="Lista svih vežbi",
     *     tags={"Vezbe"},
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Lista vežbi",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="ime", type="string", example="Čučnjevi"),
     *                 @OA\Property(property="snimak", type="string", example="https://linkdosnimka.com"),
     *                 @OA\Property(property="kategorija", type="string", example="noge")
     *             )
     *         )
     *     )
     * )
     */
    public function index()
    {
        return Vezba::all();
    }

    /**
     * @OA\Post(
     *     path="/api/vezbe",
     *     summary="Dodavanje vežbe",
     *     tags={"Vezbe"},
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"ime","snimak"},
     *             @OA\Property(property="ime", type="string", example="Čučnjevi"),
     *             @OA\Property(property="snimak", type="string", example="https://linkdosnimka.com"),
     *             @OA\Property(property="kategorija", type="string", example="noge")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Vežba uspešno dodata"
     *     )
     * )
     */
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