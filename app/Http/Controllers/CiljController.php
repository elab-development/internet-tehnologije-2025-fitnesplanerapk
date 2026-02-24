<?php

namespace App\Http\Controllers;

use App\Models\Cilj;
use App\Http\Requests\StoreCiljRequest;
use App\Http\Requests\UpdateCiljRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
class CiljController extends Controller
{
   public function store(Request $request, $userId = null)
{
    $request->validate([
        'hidriranost' => 'required|numeric',
        'tezina' => 'required|numeric',
        'kalorije' => 'required|integer',
    ]);

    // Ako nema userId u ruti, koristi prijavljenog korisnika
    $user_id = $userId ?? auth()->id();

    $cilj = Cilj::create([
        'user_id' => $user_id,
        'hidriranost' => $request->hidriranost,
        'tezina' => $request->tezina,
        'kalorije' => $request->kalorije,
    ]);

    return response()->json($cilj, 201);
}
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $ciljevi = Cilj::where('user_id', $request->user()->id)
                    ->orderBy('created_at', 'desc')
                    ->get();

        return response()->json($ciljevi);
    }
    
    public function allCilj()
    {
        $ciljevi = auth()->user()->ciljevi()->orderByDesc('created_at')->get();
        return response()->json($ciljevi);
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

    /**
     * Remove the specified resource from storage.
     */
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
        // Uzima poslednji cilj korisnika 
        $cilj = Cilj::where('user_id', Auth::id())->latest()->first();

        return response()->json([
            'cilj' => $cilj ? $cilj->kalorije : null
        ]);
    }



}
