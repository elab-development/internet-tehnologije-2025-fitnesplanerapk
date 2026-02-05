<?php

namespace App\Http\Controllers;

use App\Models\Vezba;
use Illuminate\Http\Request;
class VezbaController extends Controller
{

    

    public function store(Request $request)
    {
        $request->validate([
            'ime' => 'required|string|max:255',
            'snimak' => 'required|url'
        ]);

        return Vezba::create([
            'ime' => $request->ime,
            'snimak' => $request->snimak,
        ]);
    }
    public function index()
    {
        return Vezba::all();
    }
}