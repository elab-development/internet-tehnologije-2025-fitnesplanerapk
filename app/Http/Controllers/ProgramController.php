<?php

namespace App\Http\Controllers;

use App\Models\Program;
use Illuminate\Http\Request;

class ProgramController extends Controller
{
    public function index(Request $request)
    {
        return Program::where('korisnik_id', $request->user()->id)
            ->with('vezbe')
            ->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'naziv' => 'required|string',
            'vezbe' => 'array'
        ]);

        $program = Program::create([
            'naziv' => $request->naziv,
            'korisnik_id' => $request->user()->id
        ]);

        if ($request->has('vezbe')) {
            $program->vezbe()->attach($request->vezbe);
        }

        return response()->json($program, 201);
    }

    public function destroy($id)
    {
        Program::findOrFail($id)->delete();

        return response()->json([
            'poruka' => 'Program obrisan'
        ]);
    }
}
