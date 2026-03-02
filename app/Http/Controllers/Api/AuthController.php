<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Uloge;
use Illuminate\Http\Request;
use App\Http\Requests\RegisterRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\LoginRequest;
use App\Http\Controllers\Controller;

class AuthController extends Controller
{
    // /**
    //  * @OA\Post(
    //  * path="/api/register",
    //  * summary="Registracija novog korisnika",
    //  * tags={"Autentifikacija"},
    //  * @OA\RequestBody(
    //  * required=true,
    //  * @OA\JsonContent(
    //  * required={"ime","prezime","email","username","password","pol","datumRodjenja"},
    //  * @OA\Property(property="ime", type="string", example="Jovan"),
    //  * @OA\Property(property="prezime", type="string", example="Jovanović"),
    //  * @OA\Property(property="email", type="string", format="email", example="jovan@example.com"),
    //  * @OA\Property(property="username", type="string", example="jovan123"),
    //  * @OA\Property(property="password", type="string", format="password", example="Pass123!"),
    //  * @OA\Property(property="pol", type="string", example="muski"),
    //  * @OA\Property(property="datumRodjenja", type="string", format="date", example="1995-05-15"),
    //  * @OA\Property(property="uloga", type="string", example="korisnik")
    //  * )
    //  * ),
    //  * @OA\Response(response=201, description="Korisnik uspešno registrovan"),
    //  * @OA\Response(response=422, description="Validaciona greška")
    //  * )
    //  */
    public function register(RegisterRequest $request)
    {
        $data = $request->validated();

        
        if (isset($data['uloga'])) {
            $uloga = Uloge::where('ime', $data['uloga'])->first();
            if (!$uloga) {
                return response()->json(['message' => 'Odabrana uloga ne postoji!'], 422);
            }
        } else {
            
            $uloga = Uloge::where('ime', 'korisnik')->first();
            if (!$uloga) {
                return response()->json(['message' => 'Default uloga nije pronađena u bazi!'], 500);
            }
        }

        /** @var User $user */
        $user = User::create([
            'ime' => $data['ime'],
            'prezime' => $data['prezime'],
            'email' => $data['email'],
            'username' => $data['username'],
            'password' => bcrypt($data['password']),
            'pol' => $data['pol'],
            'datumRodjenja' => $data['datumRodjenja'],
            'uloga_id' => $uloga->id, 
        ]);

        // Kreiranje tokena za API pristup
        $token = $user->createToken('main')->plainTextToken;

        return response()->json(compact('user', 'token'), 201);
    }

    // /**
    //  * @OA\Post(
    //  * path="/api/login",
    //  * summary="Prijava korisnika",
    //  * tags={"Autentifikacija"},
    //  * @OA\RequestBody(
    //  * required=true,
    //  * @OA\JsonContent(
    //  * required={"email","password"},
    //  * @OA\Property(property="email", type="string", example="jovan@example.com"),
    //  * @OA\Property(property="password", type="string", example="Pass123!")
    //  * )
    //  * ),
    //  * @OA\Response(response=200, description="Uspešan login"),
    //  * @OA\Response(response=401, description="Pogrešni podaci")
    //  * )
    //  */
    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Korisničko ime ili lozinka su pogrešni!'], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('main')->plainTextToken;

        return response()->json(compact('user', 'token'));
    }

    // /**
    //  * @OA\Post(
    //  * path="/api/logout",
    //  * summary="Odjava korisnika",
    //  * tags={"Autentifikacija"},
    //  * security={{"bearerAuth":{}}},
    //  * @OA\Response(response=204, description="Uspešna odjava"),
    //  * @OA\Response(response=401, description="Niste autorizovani")
    //  * )
    //  */
    public function logout(Request $request)
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();
        return response('', 204);
    }
}