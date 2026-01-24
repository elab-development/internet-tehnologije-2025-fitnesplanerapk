<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Obrok; // model za obrok
use Illuminate\Support\Facades\Auth;

class FoodController extends Controller
{
    public function index(Request $request)
{
    $today = $request->query('datum', now()->toDateString());
    $user = Auth::user();

    $obroci = Obrok::where('user_id', $user->id)
                    ->whereDate('created_at', $today)
                    ->get();

    $ukupnoKalorija = $obroci->sum('kalorije');

    return response()->json([
        'obroci' => $obroci,
        'ukupnoKalorija' => $ukupnoKalorija
    ]);
}


    public function store(Request $request)
    {
        $request->validate([
            'ime' => 'required|string',
            'kalorije' => 'required|integer'
        ]);

        $obrok = Obrok::create([
            'user_id' => Auth::id(),
            'ime' => $request->ime,
            'kalorije' => $request->kalorije,
        ]);

        return response()->json($obrok, 201);
    }

    public function destroy($id)
    {
        $obrok = Obrok::where('user_id', Auth::id())->findOrFail($id);
        $obrok->delete();
        return response()->json(['message' => 'Obrok obrisan']);
    }
    
}
