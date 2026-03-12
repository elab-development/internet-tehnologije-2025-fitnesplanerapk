<?php

namespace App\Http\Controllers;

use App\Models\Cilj;
use App\Http\Requests\StoreCiljRequest;
use App\Http\Requests\UpdateCiljRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use OpenApi\Attributes as OA;
use Illuminate\Support\Str;

class CiljController extends Controller
{
    #[OA\Post(
        path: "/cilj",
        summary: "Kreiranje novog cilja",
        tags: ["Ciljevi"],
        security: [["sanctum" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["hidriranost", "tezina", "kalorije"],
                properties: [
                    new OA\Property(property: "hidriranost", type: "number", example: 2.5),
                    new OA\Property(property: "tezina", type: "number", example: 75.5),
                    new OA\Property(property: "kalorije", type: "integer", example: 2500)
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Cilj uspešno kreiran"),
            new OA\Response(response: 422, description: "Validaciona greška")
        ]
    )]
    #[OA\Post(
        path: "/users/{user}/ciljevi",
        summary: "Trener dodaje cilj za vežbača",
        tags: ["Ciljevi"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "user", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        responses: [new OA\Response(response: 201, description: "Cilj kreiran")]
    )]
    public function store(StoreCiljRequest $request, $userId = null)
    {
        $request->validate([
            'hidriranost' => 'required|numeric',
            'tezina' => 'required|numeric',
            'kalorije' => 'required|integer',
        ]);
        $hidriranost = strip_tags($validated['hidriranost']);
        $tezina = strip_tags($validated['tezina']);
        $kalorije = strip_tags($validated['kalorije']);

        
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
        path: "/cilj",
        summary: "Prikaz poslednjeg cilja (kalorije) ili liste ciljeva",
        tags: ["Ciljevi"],
        security: [["sanctum" => []]],
        responses: [new OA\Response(response: 200, description: "OK")]
    )]
    public function index(Request $request)
    {
        // Tvoja originalna logika za listu
        $ciljevi = Cilj::where('user_id', $request->user()->id)
                    ->orderBy('created_at', 'desc')
                    ->get();

        return response()->json($ciljevi);
    }

    #[OA\Get(
        path: "/all-ciljevi",
        summary: "Dobijanje svih ciljeva korisnika",
        tags: ["Ciljevi"],
        security: [["sanctum" => []]],
        responses: [new OA\Response(response: 200, description: "OK")]
    )]
    public function allCilj()
    {
        $ciljevi = auth()->user()->ciljevi()->orderByDesc('created_at')->get();
        return response()->json($ciljevi);
    }

    #[OA\Delete(
        path: "/cilj/{id}",
        summary: "Brisanje cilja",
        tags: ["Ciljevi"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        responses: [new OA\Response(response: 200, description: "Obrisano")]
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

    public function getCilj()
    {
        
        $cilj = Cilj::where('user_id', Auth::id())->latest()->first();

        return response()->json([
            'cilj' => $cilj ? $cilj->kalorije : null
        ]);
    }
}