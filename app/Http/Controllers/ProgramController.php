<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Models\Vezba;
use Illuminate\Http\Request;

class ProgramController extends Controller
{
    // Prikaz svih programa korisnika
    public function index(Request $request)
    {
        return Program::where('korisnik_id', $request->user()->id)
            ->with(['vezbe', 'podaci'])
            ->get();
    }

    // Kreiranje programa sa vežbama i danima
    public function store(Request $request)
    {
        $request->validate([
            'naziv' => 'required|string',
            'vezbe' => 'array' // niz objekata: [{id:1, dan:1}, ...]
        ]);

        $program = Program::create([
            'naziv' => $request->naziv,
            'korisnik_id' => $request->user()->id
        ]);

        if ($request->has('vezbe')) {
            foreach ($request->vezbe as $vezba) {
                $program->vezbe()->attach($vezba['id'], ['dan' => $vezba['dan']]);
            }
        }

        return response()->json($program->load('vezbe'), 201);
    }

    // Update programa i vežbi
    public function update(Request $request, $id)
    {
        $program = Program::where('korisnik_id', $request->user()->id)->findOrFail($id);

        $request->validate([
            'naziv' => 'sometimes|string',
            'vezbe' => 'sometimes|array'
        ]);

        if ($request->has('naziv')) {
            $program->naziv = $request->naziv;
        }
        $program->save();

        if ($request->has('vezbe')) {
            // sync briše stare i dodaje nove
            $syncData = [];
            foreach ($request->vezbe as $vezba) {
                $syncData[$vezba['id']] = ['dan' => $vezba['dan']];
            }
            $program->vezbe()->sync($syncData);
        }

        return response()->json($program->load('vezbe'));
    }

    // Brisanje programa
    public function destroy(Request $request, $id)
    {
        $program = Program::where('korisnik_id', $request->user()->id)->findOrFail($id);
        $program->delete();

        return response()->json(['poruka' => 'Program obrisan']);
    }
}
