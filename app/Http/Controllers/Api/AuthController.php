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
use OpenApi\Attributes as OA; // Promenjeno u Attributes

class AuthController extends Controller
{
    #[OA\Post(
        path: '/api/register',
        summary: 'Registracija novog korisnika',
        tags: ['Auth'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['ime', 'prezime', 'email', 'username', 'password', 'pol', 'datumRodjenja'],
                properties: [
                    new OA\Property(property: 'ime', type: 'string', example: 'Tina'),
                    new OA\Property(property: 'prezime', type: 'string', example: 'Nadic'),
                    new OA\Property(property: 'email', type: 'string', example: 'tina@example.com'),
                    new OA\Property(property: 'username', type: 'string', example: 'tinan'),
                    new OA\Property(property: 'password', type: 'string', example: 'password123'),
                    new OA\Property(property: 'pol', type: 'string', example: 'zenski'),
                    new OA\Property(property: 'datumRodjenja', type: 'string', format: 'date', example: '2006-03-01'),
                    new OA\Property(property: 'uloga', type: 'string', example: 'korisnik')
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Korisnik uspešno registrovan')
        ]
    )]
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

        $token = $user->createToken('main')->plainTextToken;

        return response()->json(compact('user', 'token'), 201);
    }

    #[OA\Post(
        path: '/api/login',
        summary: 'Login korisnika',
        tags: ['Auth'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['email', 'password'],
                properties: [
                    new OA\Property(property: 'email', type: 'string', example: 'tina@example.com'),
                    new OA\Property(property: 'password', type: 'string', example: 'password123')
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Uspešan login, vraća token')
        ]
    )]
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

    #[OA\Post(
        path: '/api/logout',
        summary: 'Logout korisnika',
        tags: ['Auth'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(response: 204, description: 'Korisnik uspešno odjavljen')
        ]
    )]
    public function logout(Request $request)
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();
        return response('', 204);
    }
}