<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function allUsers()
    {
        return response()->json(
            User::whereIn('uloga_id', [1, 3])
                ->select(
                'id',
                'ime',
                'prezime',
                'email',
                'username',
                'created_at'
            )->get()
        );
    }
    public function index()
    {
        $user = auth()->user();

        if ($user->uloga_id !== 2) { 
            return response()->json(['message' => 'Nije admin'], 403);
        }

        $users = User::all();
        return response()->json($users);
    }

    

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

   

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }
}
