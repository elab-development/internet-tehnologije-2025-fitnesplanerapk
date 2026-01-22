<?php

namespace App\Http\Controllers;

use App\Models\Cilj;
use App\Http\Requests\StoreCiljRequest;
use App\Http\Requests\UpdateCiljRequest;
use Illuminate\Http\Request;
class CiljController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'hidriranost' => 'required|numeric',
            'tezina' => 'required|numeric',
            'kalorije' => 'required|integer',
        ]);

        $user = $request->user();

         $cilj = Cilj::create([
            'user_id' => auth()->id(), 
            'hidriranost' => $request->hidriranost,
            'tezina' => $request->tezina,
            'kalorije' => $request->kalorije,
        ]);

        return response()->json([
            'message' => 'Ciljevi uspešno sačuvani!',
            'cilj' => $cilj
        ]);
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
    public function destroy(Cilj $cilj)
    {
        //
    }
}
