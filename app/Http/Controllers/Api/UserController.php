<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use OpenApi\Attributes as OA;

class UserController extends Controller
{
    #[OA\Get(
        path: "/vezbaci",
        summary: "Prikazuje vežbače ulogovanog trenera",
        tags: ["Trener"],
        security: [["sanctum" => []]],
        responses: [
            new OA\Response(response: 200, description: "Lista vežbača"),
            new OA\Response(response: 403, description: "Nije trener")
        ]
    )]
    public function vezbaciTrenera()
    {
        $user = auth()->user();
        if ($user->uloga_id !== 3) {
            return response()->json(['message' => 'Nije trener'], 403);
        }
        $vezbaci = User::where('trener_id', $user->id)
            ->select('id', 'ime', 'prezime', 'email', 'username')
            ->get();
        return response()->json($vezbaci);
    }

    #[OA\Get(
        path: "/users/{user}/parametri",
        summary: "Prikazuje parametre određenog korisnika",
        tags: ["Korisnik"],
        parameters: [new OA\Parameter(name: "user", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
        responses: [new OA\Response(response: 200, description: "Lista parametara")]
    )]
    public function parametri(User $user) {
        return response()->json($user->parametri);
    }

    #[OA\Get(
        path: "/users/{user}/ciljevi",
        summary: "Prikazuje ciljeve određenog korisnika",
        tags: ["Korisnik"],
        parameters: [new OA\Parameter(name: "user", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
        responses: [new OA\Response(response: 200, description: "Lista ciljeva")]
    )]
    public function ciljevi(User $user) {
        return response()->json($user->ciljevi);
    }

    #[OA\Get(
        path: "/trener/pretraga",
        summary: "Pretraga trenera po imenu, prezimenu ili emailu",
        tags: ["Korisnik"],
        parameters: [new OA\Parameter(name: "query", in: "query", required: true, schema: new OA\Schema(type: "string"))],
        responses: [new OA\Response(response: 200, description: "Rezultati pretrage")]
    )]
    public function pretragaTrenera(Request $request)
    {
        $query = $request->query('query');
        if (!$query) return response()->json([]);

        $treneri = User::whereHas('uloga', function($q) { $q->where('ime', 'trener'); })
            ->where(function($q) use ($query) {
                $q->where('ime', 'like', "%{$query}%")
                  ->orWhere('prezime', 'like', "%{$query}%")
                  ->orWhere('email', 'like', "%{$query}%");
            })->get(['id', 'ime', 'prezime', 'email']);

        return response()->json($treneri);
    }

    #[OA\Post(
        path: "/trener/postavi",
        summary: "Vežbač bira sebi trenera",
        tags: ["Korisnik"],
        security: [["sanctum" => []]],
        requestBody: new OA\RequestBody(
            content: new OA\JsonContent(properties: [new OA\Property(property: "trener_id", type: "integer")])
        ),
        responses: [new OA\Response(response: 200, description: "Uspešno")]
    )]
    public function postaviTrenera(Request $request)
    {
        $request->validate(['trener_id' => 'required|exists:users,id']);
        $korisnik = Auth::user();
        $trener = User::where('id', $request->trener_id)
                      ->whereHas('uloga', function($q){ $q->where('ime', 'trener'); })
                      ->first();

        if (!$trener) return response()->json(['message' => 'Izabrani korisnik nije trener'], 400);

        $korisnik->trener_id = $trener->id;
        $korisnik->save();

        return response()->json(['message' => 'Trener uspešno postavljen', 'trener' => $trener->only(['id','ime','prezime','email'])]);
    }

    #[OA\Post(
        path: "/trener/profil",
        summary: "Ažuriranje profila za trenere",
        tags: ["Trener"],
        security: [["sanctum" => []]],
        responses: [new OA\Response(response: 200, description: "Uspešno ažurirano")]
    )]
    public function updateProfil(Request $request)
    {
        $user = auth()->user();
        if (!$user->isTrener()) return response()->json(['message' => 'Nemate dozvolu.'], 403);

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
            if ($user->profile_image) Storage::disk('public')->delete($user->profile_image);
            $data['profile_image'] = $request->file('profile_image')->store('profile_images', 'public');
        }

        if (!empty($data['password'])) $data['password'] = Hash::make($data['password']);
        else unset($data['password']);

        $user->update($data);
        return response()->json(['message' => 'Profil uspešno ažuriran', 'user' => $user]);
    }

    #[OA\Post(
        path: "/trener/ukloni",
        summary: "Vežbač uklanja trenutnog trenera",
        tags: ["Korisnik"],
        security: [["sanctum" => []]],
        responses: [new OA\Response(response: 200, description: "Trener uklonjen")]
    )]
    public function ukloniTrenera()
    {
        $korisnik = Auth::user();
        $korisnik->trener_id = null;
        $korisnik->save();
        return response()->json(['message' => 'Trener uklonjen']);
    }

    #[OA\Post(
        path: "/users/{user}/parametri",
        summary: "Dodavanje novih parametara korisniku (samo trener)",
        tags: ["Trener"],
        security: [["sanctum" => []]],
        parameters: [new OA\Parameter(name: "user", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
        requestBody: new OA\RequestBody(
            content: new OA\JsonContent(required: ["date", "tezina", "visina"], properties: [
                new OA\Property(property: "date", type: "string", format: "date"),
                new OA\Property(property: "tezina", type: "number"),
                new OA\Property(property: "visina", type: "number"),
                new OA\Property(property: "bmi", type: "number"),
                new OA\Property(property: "masti", type: "number"),
                new OA\Property(property: "misici", type: "number"),
                new OA\Property(property: "obim_struka", type: "number"),
            ])
        ),
        responses: [new OA\Response(response: 200, description: "Parametri dodati")]
    )]
    public function storeParametar(Request $request, User $user)
    {
        $authUser = auth()->user();
        if ($authUser->uloga_id !== 3) return response()->json(['message' => 'Nije trener'], 403);

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
        path: "/users/{user}",
        summary: "Prikaz detalja korisnika sa parametrima i ciljevima",
        tags: ["Admin", "Trener"],
        parameters: [new OA\Parameter(name: "user", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
        responses: [new OA\Response(response: 200, description: "Detalji korisnika")]
    )]
    public function show(User $user) {
        $user->load('parametri', 'ciljevi');
        return response()->json($user);
    }

    #[OA\Get(
        path: "/admin/users",
        summary: "Lista svih vežbača i trenera (bez admina)",
        tags: ["Admin"],
        responses: [new OA\Response(response: 200, description: "Lista korisnika")]
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
        path: "/admin/complete-users",
        summary: "Kompletna lista svih korisnika (Admin)",
        tags: ["Admin"],
        security: [["sanctum" => []]],
        responses: [new OA\Response(response: 200, description: "Svi podaci")]
    )]
    public function index()
    {
        $user = auth()->user();
        if ($user->uloga_id !== 2) return response()->json(['message' => 'Nije admin'], 403);
        return response()->json(User::all());
    }

    #[OA\Post(
        path: "/assign-vezbac-trener",
        summary: "Admin povezuje vežbača i trenera",
        tags: ["Admin"],
        security: [["sanctum" => []]],
        requestBody: new OA\RequestBody(
            content: new OA\JsonContent(properties: [
                new OA\Property(property: "trener_id", type: "integer"),
                new OA\Property(property: "vezbac_id", type: "integer")
            ])
        ),
        responses: [new OA\Response(response: 200, description: "Uspešno povezano")]
    )]
    public function assignVezbacToTrener(Request $request)
    {
        $request->validate([
            'trener_id' => 'required|exists:users,id',
            'vezbac_id' => 'required|exists:users,id',
        ]);

        $trener = User::find($request->trener_id);
        $vezbac = User::find($request->vezbac_id);

        if (!$trener->isTrener()) return response()->json(['message' => 'Odabrani korisnik nije trener'], 400);
        if (!$vezbac->isVezbac()) return response()->json(['message' => 'Odabrani korisnik nije vezbač'], 400);

        $vezbac->trener()->associate($trener);
        $vezbac->save();

        return response()->json(['message' => 'Vezbač uspešno povezan sa trenerom', 'vezbac' => $vezbac, 'trener' => $trener]);
    }

    #[OA\Get(
        path: "/trener/{trener_id}/vezbaci",
        summary: "Prikaz svih vežbača određenog trenera",
        tags: ["Admin"],
        parameters: [new OA\Parameter(name: "trener_id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
        responses: [new OA\Response(response: 200, description: "Lista")]
    )]
    public function getVezbaciTrenera($trener_id)
    {
        $trener = User::findOrFail($trener_id);
        if (!$trener->isTrener()) return response()->json(['message' => 'Korisnik nije trener'], 400);
        return response()->json($trener->vezbaci);
    }

    #[OA\Get(
        path: "/vezbac/{vezbac_id}/trener",
        summary: "Prikaz trenera određenog vežbača",
        tags: ["Admin", "Korisnik"],
        parameters: [new OA\Parameter(name: "vezbac_id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
        responses: [new OA\Response(response: 200, description: "Podaci o treneru")]
    )]
    public function getTrenerVezbaca($vezbac_id)
    {
        $vezbac = User::findOrFail($vezbac_id);
        if (!$vezbac->isVezbac()) return response()->json(['message' => 'Korisnik nije vezbač'], 400);
        return response()->json($vezbac->trener);
    }

    #[OA\Post(
        path: "/korisnik/profil",
        summary: "Ažuriranje profila za vežbače",
        tags: ["Korisnik"],
        security: [["sanctum" => []]],
        responses: [new OA\Response(response: 200, description: "Uspešno")]
    )]
    public function updateProfilKorisnika(Request $request)
    {
        $user = auth()->user();
        if ($user->uloga_id !== 1) return response()->json(['message' => 'Nemate dozvolu.'], 403);

        $data = $request->validate([
            'ime' => 'required|string|max:255',
            'prezime' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,' . $user->id,
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:6|confirmed', 
        ]);

        if (!empty($data['password'])) $data['password'] = Hash::make($data['password']);
        else unset($data['password']);

        $user->update($data);
        return response()->json(['message' => 'Profil uspešno ažuriran', 'user' => $user]);
    }
}