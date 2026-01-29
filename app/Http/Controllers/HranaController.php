<?php

namespace App\Http\Controllers;

use App\Models\Hrana;
use Illuminate\Http\Request;

class HranaController extends Controller
{
    // Vraća sve namirnice/hranу
    public function index()
    {
        $hrana = Hrana::all(); // uzima sve iz tabele 'hrana'
        return response()->json($hrana);
    }
}
