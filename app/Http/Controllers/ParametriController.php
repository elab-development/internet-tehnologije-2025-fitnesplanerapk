<?php

namespace App\Http\Controllers;

use App\Models\Parametri;
use App\Http\Requests\StoreParametriRequest;
use App\Http\Requests\UpdateParametriRequest;

class ParametriController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $parametri = Parametri::where('user_id', $request->user()->id)
                        ->orderBy('date', 'desc')
                        ->get();

        return response()->json($parametri);
    }

    public function allParametri()
    {
        $parametri = auth()->user()->parametri()->orderByDesc('date')->get();
        return response()->json($parametri);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreParametriRequest $request)
{
    $validated = $request->validate([
            'date' => 'required|date',
            'tezina' => 'required|numeric',
            'visina' => 'required|numeric',
            'masti' => 'required|numeric',
            'misici' => 'required|numeric',
            'obim_struka' => 'required|numeric',
        ]);

    $visinaUMetrima = $validated['visina'] / 100;
    $bmi = $validated['tezina'] / ($visinaUMetrima * $visinaUMetrima);

    $parametri = Parametri::create([
        'user_id' => auth()->id(),
        'date' => $validated['date'],
        'tezina' => $validated['tezina'],
        'visina' => $validated['visina'],
        'bmi' => round($bmi, 2),
        'masti' => $validated['masti'],
        'misici' => $validated['misici'],
        'obim_struka' => $validated['obim_struka'],
    ]);

    return response()->json([
        'message' => 'Parametri uspešno sačuvani',
        'parametri' => $parametri
    ], 201);
}

    /**
     * Display the specified resource.
     */
    public function show(Parametri $parametri)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Parametri $parametri)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateParametriRequest $request, Parametri $parametri)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    // public function destroy(Request $request, $id)
    // {
    //     $user = $request->user();
    //     $parametar = Parametar::where('id', $id)->where('user_id', $user->id)->first();

    //     if (!$parametar) {
    //         return response()->json(['message' => 'Parametar nije pronađen'], 404);
    //     }

    //     $parametar->delete();
    //     return response()->json(['message' => 'Parametar obrisan']);
    // }
    public function destroy($id)
    {
        $parametar = Parametri::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $parametar->delete();

        return response()->json([
            'message' => 'Parametar uspešno obrisan'
        ]);
    }
}
