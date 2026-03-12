<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Hidriranost;
use Illuminate\Support\Facades\Auth;
use OpenApi\Attributes as OA;

class HidriranostController extends Controller
{
    #[OA\Get(
        path: "/hidriranost",
        summary: "Prikaz svih zapisa o hidriranosti",
        tags: ["Hidriranost"],
        security: [["sanctum" => []]],
        responses: [
            new OA\Response(response: 200, description: "Lista svih zapisa")
        ]
    )]
    public function index()
    {
        $hidriranosti = Hidriranost::with('user')->get(); // sa korisnikom, opcionalno
        return response()->json($hidriranosti);
    }

    #[OA\Get(
        path: "/hidriranost-danas",
        summary: "Provera da li postoji zapis o hidriranosti za današnji dan",
        tags: ["Hidriranost"],
        security: [["sanctum" => []]],
        responses: [
            new OA\Response(response: 200, description: "Informacija o postojanju zapisa")
        ]
    )]
    public function danas()
    {
        if (!Auth::check()) {
            return response()->json(['exists' => false, 'data' => null], 200);
        }

        $userId = Auth::id();
        $today = now()->toDateString();

        $hidriranost = Hidriranost::where('user_id', $userId)
            ->whereDate('created_at', $today)
            ->first();

        return response()->json([
            'exists' => $hidriranost ? true : false,
            'data' => $hidriranost ?? null
        ], 200);
    }

    #[OA\Post(
        path: "/hidriranost",
        summary: "Kreiranje novog zapisa o hidriranosti za danas",
        tags: ["Hidriranost"],
        security: [["sanctum" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "ukupno", type: "number", example: 0.5)
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Zapis kreiran"),
            new OA\Response(response: 400, description: "Zapis za danas već postoji")
        ]
    )]
    public function store(Request $request)
    {
        $request->validate([
            'ukupno' => 'required|numeric|min:0',
        ]);

        $userId = Auth::id();
        $today = now()->toDateString();

        
        $exists = Hidriranost::where('user_id', $userId)
            ->whereDate('created_at', $today)
            ->first();

        if ($exists) {
            return response()->json([
                'error' => 'Već postoji hidriranost za danas'
            ], 400);
        }

        $hidriranost = Hidriranost::create([
            'user_id' => $userId,
            'ukupno' => $request->ukupno
        ]);

        return response()->json($hidriranost);
    }

    #[OA\Put(
        path: "/hidriranost/{hidriranost}",
        summary: "Dodavanje količine vode na današnji zapis",
        tags: ["Hidriranost"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "ukupno", type: "number", example: 0.25)
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Vrednost ažurirana"),
            new OA\Response(response: 404, description: "Zapis nije pronađen")
        ]
    )]
    public function update(Request $request, $id)
    {
    $request->validate([
        'ukupno' => 'required|numeric|min:0',
    ]);

    $userId = $request->user()->id;
    $novaVrednost = $request->ukupno;

    
    $hidriranost = Hidriranost::where('user_id', $userId)
                              ->whereDate('datum', now())
                              ->first();

    if (!$hidriranost) {
        return response()->json([
            'message' => 'Zapis za danas ne postoji'
        ], 404);
    }

   
    $hidriranost->ukupno += $novaVrednost;
    $hidriranost->save();

    return response()->json($hidriranost);
    }
}