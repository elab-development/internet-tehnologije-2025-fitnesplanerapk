<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\RegisterRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\LoginRequest;
use App\Http\Controllers\Controller;
class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $credentials=$request->validated();
        if(!Auth::attempt($credentials)){
            return response([
                'message'=>'Korisničko ime ili lozinka su pogrešni!'
            ]);
        }
        /**@var User $user */
        $user=Auth::user();
        $token=$user->createToken('main')->plainTextToken;
         return response(compact('user', 'token'));
    }

    public function logout(Request $request)
    {
        /**@var user $user */
        $user=$request->user();
        $user->currentAccessToken()->delete();
        return response('', 204);
    }

    public function register(RegisterRequest $request) 
    {
        $data=$request->validated();
        /**@var \app\Models\User $user*/
        $user = User::create([
            'ime' => $data['ime'],
            'prezime' => $data['prezime'],
            'email' => $data['email'],       
            'username' => $data['username'],
            'password' => bcrypt($data['password']),
            'pol' => $data['pol'],
            'datum_rodjenja' => $data['datumRodjenja'],
        ]);

        $token = $user->createToken('main')->plainTextToken;

        return response(compact('user', 'token'));
    }
}
