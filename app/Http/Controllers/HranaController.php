<?php

namespace App\Http\Controllers;

use App\Models\Hrana;
use Illuminate\Http\Request;

class HranaController extends Controller
{
    
    public function index()
    {
        $hrana = Hrana::all();
        return response()->json($hrana);
    }
}
