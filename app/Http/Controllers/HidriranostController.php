<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Hidriranost;
use Illuminate\Support\Facades\Auth;

class HidriranostController extends Controller
{
   public function index()
    {
        $hidriranosti = Hidriranost::with('user')->get(); // sa korisnikom, opcionalno
        return response()->json($hidriranosti);
    }

    public function danas()
    {
        if (!Auth::check()) {
            return response()->json(['exists' => false, 'data' => null], 200);
        }

        $userId = Auth::id();
        $today = now()->toDateString();

        $hidriranost = Hidriranost::where('user_id', $userId)
            ->whereDate('created_at', $today)
            ->first();

        return response()->json([
            'exists' => $hidriranost ? true : false,
            'data' => $hidriranost ?? null
        ], 200);
    }

    
    public function store(Request $request)
    {
        $request->validate([
            'ukupno' => 'required|numeric|min:0',
        ]);

        $userId = Auth::id();
        $today = now()->toDateString();

        
        $exists = Hidriranost::where('user_id', $userId)
            ->whereDate('created_at', $today)
            ->first();

        if ($exists) {
            return response()->json([
                'error' => 'Već postoji hidriranost za danas'
            ], 400);
        }

        $hidriranost = Hidriranost::create([
            'user_id' => $userId,
            'ukupno' => $request->ukupno
        ]);

        return response()->json($hidriranost);
    }

  
    public function update(Request $request, $id)
    {
    $request->validate([
        'ukupno' => 'required|numeric|min:0',
    ]);

    $userId = $request->user()->id;
    $novaVrednost = $request->ukupno;

    
    $hidriranost = Hidriranost::where('user_id', $userId)
                              ->whereDate('datum', now())
                              ->first();

    if (!$hidriranost) {
        return response()->json([
            'message' => 'Zapis za danas ne postoji'
        ], 404);
    }

   
    $hidriranost->ukupno += $novaVrednost;
    $hidriranost->save();

    return response()->json($hidriranost);
    }
}
