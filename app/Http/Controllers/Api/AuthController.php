<?php

// namespace App\Http\Controllers\Api;

// use App\Models\User;
// use Illuminate\Http\Request;
// use App\Http\Requests\RegisterRequest;
// use Illuminate\Support\Facades\Hash;
// use Illuminate\Support\Facades\Auth;
// use App\Http\Requests\LoginRequest;
// use App\Http\Controllers\Controller;
// class AuthController extends Controller
// {
//     public function login(LoginRequest $request)
//     {
//         $credentials=$request->validated();
//         if(!Auth::attempt($credentials)){
//             return response([
//                 'message'=>'Korisničko ime ili lozinka su pogrešni!'
//             ]);
//         }
//         /**@var User $user */
//         $user=Auth::user();
//         $token=$user->createToken('main')->plainTextToken;
//          return response(compact('user', 'token'));
//     }

//     public function logout(Request $request)
//     {
//         /**@var user $user */
//         $user=$request->user();
//         $user->currentAccessToken()->delete();
//         return response('', 204);
//     }

//     // public function register(RegisterRequest $request) 
//     // {
//     //     $data=$request->validated();
//     //     /**@var \app\Models\User $user*/
//     //     $user = User::create([
//     //         'ime' => $data['ime'],
//     //         'prezime' => $data['prezime'],
//     //         'email' => $data['email'],       
//     //         'username' => $data['username'],
//     //         'password' => bcrypt($data['password']),
//     //         'pol' => $data['pol'],
//     //         'datumRodjenja' => $data['datumRodjenja'],
//     //         'uloga_id' => 1,
//     //     ]);

//     //     $token = $user->createToken('main')->plainTextToken;

//     //     return response(compact('user', 'token'));
//     // }
//     public function register(RegisterRequest $request)
// {
    
//     $data = $request->validated();

    
//     $defaultUloga = \App\Models\Uloge::where('ime', 'korisnik')->first();
//     if (!$defaultUloga) {
//         // fallback ako uloga ne postoji
//         abort(500, 'Default uloga nije definisana u bazi!');
//     }

    
//     $user = User::create([
//         'ime' => $data['ime'],
//         'prezime' => $data['prezime'],
//         'email' => $data['email'],
//         'username' => $data['username'],
//         'password' => bcrypt($data['password']), 
//         'pol' => $data['pol'],
//         'datumRodjenja' => $data['datumRodjenja'], 
//         'uloga_id' => $defaultUloga->id, 
//     ]);

   
//     $token = $user->createToken('main')->plainTextToken;

    
//     return response()->json([
//         'user' => $user,
//         'token' => $token,
//     ], 201); // 201 = Created
// }

// }


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
    public function register(RegisterRequest $request)
    {
        $data = $request->validated();

       
        $defaultUloga = Uloge::where('ime', 'korisnik')->first();

        if (!$defaultUloga) {
            return response()->json(['message' => 'Default uloga nije pronađena u bazi!'], 500);
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
            'uloga_id' => $defaultUloga->id, // automatski dodeljujemo
        ]);

        $token = $user->createToken('main')->plainTextToken;

        return response()->json(compact('user', 'token'), 201);
    }

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

    public function logout(Request $request)
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();
        return response('', 204);
    }
}
