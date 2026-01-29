<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Podaci;

class PodaciController extends Controller
{
    // Unos podataka za vežbu
    public function store(Request $request)
    {
        $request->validate([
            'vezba_id' => 'required|integer|exists:vezbas,id',
            'trajanje' => 'nullable|integer',
            'serija' => 'nullable|integer',
            'ponavljanja' => 'nullable|integer',
            'tezina' => 'nullable|numeric',
            'bpm' => 'nullable|integer'
        ]);

        $podaci = Podaci::create([
            'vezba_id' => $request->vezba_id,
            'trajanje' => $request->trajanje,
            'serija' => $request->serija,
            'ponavljanja' => $request->ponavljanja,
            'tezina' => $request->tezina,
            'bpm' => $request->bpm
        ]);

        return response()->json($podaci, 201);
    }

    // Update podataka o vežbi
    public function update(Request $request, $id)
    {
        $podaci = Podaci::findOrFail($id);

        $request->validate([
            'trajanje' => 'nullable|integer',
            'serija' => 'nullable|integer',
            'ponavljanja' => 'nullable|integer',
            'tezina' => 'nullable|numeric',
            'bpm' => 'nullable|integer'
        ]);

        $podaci->update($request->only(['trajanje','serija','ponavljanja','tezina','bpm']));

        return response()->json($podaci);
    }
}