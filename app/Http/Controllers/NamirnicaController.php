<?php

namespace App\Http\Controllers;

use App\Models\Hrana;

class HranaController extends Controller
{
    public function index()
    {
        return Hrana::orderBy('naziv')->get();
    }
}
