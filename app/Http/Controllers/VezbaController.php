<?php

namespace App\Http\Controllers;

use App\Models\Vezba;

class VezbaController extends Controller
{
    public function index()
    {
        return Vezba::all();
    }
}

