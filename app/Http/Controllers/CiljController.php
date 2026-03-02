<?php

namespace App\Http\Controllers;

use App\Models\Cilj;
use App\Http\Requests\StoreCiljRequest;
use App\Http\Requests\UpdateCiljRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use OpenApi\Attributes as OA;

class CiljController extends Controller
{
    #[OA\Post(
        path: '/api/cilj',
        summary: 'Dodavanje cilja korisnika',
        tags: ['Cilj'],
        security: [['sanctum' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['hidriranost', 'tezina', 'kalorije'],
                properties: [
                    new OA\Property(property: 'hidriranost', type: 'number', example: 2),
                    new OA\Property(property: 'tezina', type: 'number', example: 70),
                    new OA\Property(property: 'kalorije', type: 'integer', example: 2000)
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Cilj uspešno dodat')
        ]
    )]
    public function store(StoreCiljRequest $request, $userId = null)
    {
        $request->validate([
            'hidriranost' => 'required|numeric',
            'tezina' => 'required|numeric',
            'kalorije' => 'required|integer',
        ]);

        $user_id = $userId ?? auth()->id();

        $cilj = Cilj::create([
            'user_id' => $user_id,
            'hidriranost' => $request->hidriranost,
            'tezina' => $request->tezina,
            'kalorije' => $request->kalorije,
        ]);

        return response()->json($cilj, 201);
    }

    #[OA\Get(
        path: '/api/cilj',
        summary: 'Prikaz trenutnog cilja korisnika',
        tags: ['Cilj'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(response: 200, description: 'Trenutni cilj korisnika')
        ]
    )]
    public function index(Request $request)
    {
        $ciljevi = Cilj::where('user_id', $request->user()->id)
                    ->orderBy('created_at', 'desc')
                    ->get();

        return response()->json($ciljevi);
    }

    #[OA\Get(
        path: '/api/cilj/last',
        summary: 'Dohvat poslednjeg cilja korisnika',
        tags: ['Cilj'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(response: 200, description: 'Poslednji cilj korisnika')
        ]
    )]
    public function getCilj()
    {
        $cilj = Cilj::where('user_id', Auth::id())->latest()->first();

        return response()->json([
            'cilj' => $cilj ? $cilj->kalorije : null
        ]);
    }

    #[OA\Delete(
        path: '/api/cilj/{id}',
        summary: 'Brisanje cilja',
        tags: ['Cilj'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer')
            )
        ],
        responses: [
            new OA\Response(response: 200, description: 'Cilj uspešno obrisan'),
            new OA\Response(response: 404, description: 'Cilj nije pronađen')
        ]
    )]
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $cilj = Cilj::where('id', $id)->where('user_id', $user->id)->first();

        if (!$cilj) {
            return response()->json(['message' => 'Cilj nije pronađen'], 404);
        }

        $cilj->delete();
        return response()->json(['message' => 'Cilj obrisan']);
    }

    


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Cilj $cilj)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Cilj $cilj)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCiljRequest $request, Cilj $cilj)
    {
        //
    }
}