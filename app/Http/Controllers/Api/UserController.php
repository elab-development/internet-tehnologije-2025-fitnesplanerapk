<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use OpenApi\Attributes as OA; // Promenjeno u Attributes

class UserController extends Controller
{
    #[OA\Get(
        path: '/api/users/{user}',
        summary: 'Prikaz korisnika',
        tags: ['User'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'user', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))
        ],
        responses: [
            new OA\Response(response: 200, description: 'Detalji korisnika')
        ]
    )]
    public function show(User $user)
    {
        $user->load('parametri', 'ciljevi');
        return response()->json($user);
    }

    #[OA\Get(
        path: '/api/vezbaci',
        summary: 'Lista vežbača trenera',
        tags: ['User'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(response: 200, description: 'Lista vežbača')
        ]
    )]
    public function vezbaciTrenera()
    {
        $user = auth()->user();

        if ($user->uloga_id !== 3) { // 3 = trener
            return response()->json(['message' => 'Nije trener'], 403);
        }

        $vezbaci = User::where('trener_id', $user->id)
            ->select('id', 'ime', 'prezime', 'email', 'username')
            ->get();

        return response()->json($vezbaci);
    }

    #[OA\Post(
        path: '/api/trener/postavi',
        summary: 'Postavljanje trenera korisniku',
        tags: ['User'],
        security: [['sanctum' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['trener_id'],
                properties: [
                    new OA\Property(property: 'trener_id', type: 'integer', example: 2)
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Trener uspešno postavljen')
        ]
    )]
    public function postaviTrenera(Request $request)
    {
        $request->validate([
            'trener_id' => 'required|exists:users,id'
        ]);

        $korisnik = Auth::user();

        $trener = User::where('id', $request->trener_id)
                      ->whereHas('uloga', fn($q) => $q->where('ime', 'trener'))
                      ->first();

        if (!$trener) {
            return response()->json(['message' => 'Izabrani korisnik nije trener'], 400);
        }

        $korisnik->trener_id = $trener->id;
        $korisnik->save();

        return response()->json([
            'message' => 'Trener uspešno postavljen',
            'trener' => $trener->only(['id','ime','prezime','email'])
        ]);
    }

    #[OA\Patch(
        path: '/api/profil/update',
        summary: 'Update profila trenera',
        tags: ['User'],
        security: [['sanctum' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'ime', type: 'string'),
                    new OA\Property(property: 'prezime', type: 'string'),
                    new OA\Property(property: 'username', type: 'string'),
                    new OA\Property(property: 'email', type: 'string'),
                    new OA\Property(property: 'password', type: 'string'),
                    new OA\Property(property: 'password_confirmation', type: 'string'),
                    new OA\Property(property: 'biografija', type: 'string'),
                    new OA\Property(property: 'profile_image', type: 'string', format: 'binary')
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Profil uspešno ažuriran')
        ]
    )]
    public function updateProfil(Request $request)
    {
        $user = auth()->user();
        if (!$user->isTrener()) {
            return response()->json(['message' => 'Nemate dozvolu.'], 403);
        }

        $data = $request->validate([
            'ime' => 'required|string|max:255',
            'prezime' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,' . $user->id,
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:6|confirmed',
            'biografija' => 'nullable|string',
            'profile_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        if ($request->hasFile('profile_image')) {
            if ($user->profile_image) {
                Storage::disk('public')->delete($user->profile_image);
            }
            $data['profile_image'] = $request->file('profile_image')->store('profile_images', 'public');
        }

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return response()->json([
            'message' => 'Profil uspešno ažuriran',
            'user' => $user
        ]);
    }

    #[OA\Post(
        path: '/api/trener/ukloni',
        summary: 'Uklanjanje trenera sa korisnika',
        tags: ['User'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(response: 200, description: 'Trener uklonjen')
        ]
    )]
    public function ukloniTrenera()
    {
        $korisnik = Auth::user();
        $korisnik->trener_id = null;
        $korisnik->save();

        return response()->json(['message' => 'Trener uklonjen']);
    }

    #[OA\Post(
        path: '/api/users/{user}/parametar',
        summary: 'Dodavanje parametara korisniku (samo trener)',
        tags: ['User'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'user', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'date', type: 'string', format: 'date'),
                    new OA\Property(property: 'tezina', type: 'number'),
                    new OA\Property(property: 'visina', type: 'number'),
                    new OA\Property(property: 'bmi', type: 'number'),
                    new OA\Property(property: 'masti', type: 'number'),
                    new OA\Property(property: 'misici', type: 'number'),
                    new OA\Property(property: 'obim_struka', type: 'number')
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Parametar dodat')
        ]
    )]
    public function storeParametar(Request $request, User $user)
    {
        $authUser = auth()->user();
        if ($authUser->uloga_id !== 3) {
            return response()->json(['message' => 'Nije trener'], 403);
        }

        $request->validate([
            'date' => 'required|date',
            'tezina' => 'required|numeric',
            'visina' => 'required|numeric',
            'bmi' => 'required|numeric',
            'masti' => 'required|numeric',
            'misici' => 'required|numeric',
            'obim_struka' => 'required|numeric',
        ]);

        $param = $user->parametri()->create($request->all());
        return response()->json($param);
    }

    #[OA\Get(
        path: '/api/users/all',
        summary: 'Prikaz svih korisnika (admin)',
        tags: ['User'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(response: 200, description: 'Lista korisnika')
        ]
    )]
    public function allUsers()
    {
        return response()->json(
            User::whereIn('uloga_id', [1, 3])
                ->select('id', 'ime', 'prezime', 'email', 'username', 'created_at')
                ->get()
        );
    }

    #[OA\Get(
        path: '/api/users/pretraga',
        summary: 'Pretraga trenera po imenu, prezimenu ili emailu',
        tags: ['User'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'query', in: 'query', required: false, schema: new OA\Schema(type: 'string'))
        ],
        responses: [
            new OA\Response(response: 200, description: 'Lista trenera')
        ]
    )]
    public function pretragaTrenera(Request $request)
    {
        $query = $request->query('query');
        if (!$query) return response()->json([]);

        $treneri = User::whereHas('uloga', fn($q) => $q->where('ime', 'trener'))
            ->where(fn($q) => $q->where('ime', 'like', "%{$query}%")
                                ->orWhere('prezime', 'like', "%{$query}%")
                                ->orWhere('email', 'like', "%{$query}%"))
            ->get(['id','ime','prezime','email']);

        return response()->json($treneri);
    }

    #[OA\Post(
        path: '/api/users/assign',
        summary: 'Povezivanje vezbača sa trenerom',
        tags: ['User'],
        security: [['sanctum' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'trener_id', type: 'integer'),
                    new OA\Property(property: 'vezbac_id', type: 'integer')
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Vezbač povezan sa trenerom')
        ]
    )]
    public function assignVezbacToTrener(Request $request)
    {
        $request->validate([
            'trener_id' => 'required|exists:users,id',
            'vezbac_id' => 'required|exists:users,id',
        ]);

        $trener = User::find($request->trener_id);
        $vezbac = User::find($request->vezbac_id);

        if (!$trener->isTrener()) return response()->json(['message'=>'Odabrani korisnik nije trener'],400);
        if (!$vezbac->isVezbac()) return response()->json(['message'=>'Odabrani korisnik nije vezbač'],400);

        $vezbac->trener()->associate($trener);
        $vezbac->save();

        return response()->json([
            'message' => 'Vezbač uspešno povezan sa trenerom',
            'vezbac' => $vezbac,
            'trener' => $trener
        ]);
    }

    #[OA\Get(
        path: '/api/trener/{trener_id}/vezbaci',
        summary: 'Lista vežbača određenog trenera',
        tags: ['User'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'trener_id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))
        ],
        responses: [
            new OA\Response(response: 200, description: 'Lista vežbača')
        ]
    )]
    public function getVezbaciTrenera($trener_id)
    {
        $trener = User::findOrFail($trener_id);
        if (!$trener->isTrener()) return response()->json(['message'=>'Korisnik nije trener'],400);

        return response()->json($trener->vezbaci);
    }

    #[OA\Get(
        path: '/api/vezbac/{vezbac_id}/trener',
        summary: 'Prikaz trenera vezbača',
        tags: ['User'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'vezbac_id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))
        ],
        responses: [
            new OA\Response(response: 200, description: 'Trener vezbača')
        ]
    )]
    public function getTrenerVezbaca($vezbac_id)
    {
        $vezbac = User::findOrFail($vezbac_id);
        if (!$vezbac->isVezbac()) return response()->json(['message'=>'Korisnik nije vezbač'],400);

        return response()->json($vezbac->trener);
    }

    #[OA\Patch(
        path: '/api/profil/update/korisnik',
        summary: 'Update profila vezbača',
        tags: ['User'],
        security: [['sanctum' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'ime', type: 'string'),
                    new OA\Property(property: 'prezime', type: 'string'),
                    new OA\Property(property: 'username', type: 'string'),
                    new OA\Property(property: 'email', type: 'string'),
                    new OA\Property(property: 'password', type: 'string'),
                    new OA\Property(property: 'password_confirmation', type: 'string')
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Profil uspešno ažuriran')
        ]
    )]
    public function updateProfilKorisnika(Request $request)
    {
        $user = auth()->user();
        if ($user->uloga_id !== 1) {
            return response()->json(['message' => 'Nemate dozvolu.'], 403);
        }

        $data = $request->validate([
            'ime' => 'required|string|max:255',
            'prezime' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,' . $user->id,
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:6|confirmed',
        ]);

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return response()->json([
            'message' => 'Profil uspešno ažuriran',
            'user' => $user
        ]);
    }
}