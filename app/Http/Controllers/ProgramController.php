<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Models\Vezba;
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
            'vezbe' => 'required|array',
            'vezbe.*.id' => 'required|integer|exists:vezbe,id',
            'vezbe.*.dan' => 'required|integer|min:1',
            'vezbe.*.serija' => 'nullable|integer|min:0',
            'vezbe.*.ponavljanja' => 'nullable|integer|min:0',
            'vezbe.*.tezina' => 'nullable|numeric|min:0',
            'vezbe.*.trajanje' => 'nullable|integer|min:0',
            'vezbe.*.bpm' => 'nullable|integer|min:0',
        ]);

        
        $program = Program::create([
            'naziv' => $request->naziv,
            'korisnik_id' => auth()->id(),
            'datum' => now(),
        ]);

        $ukupno_trajanje = 0;
        $ukupno_kalorije = 0;

        if ($request->has('vezbe')) {
            foreach ($request->vezbe as $vezba) {

                $serija = (float)($vezba['serija'] ?? 0);
                $ponavljanja = (float)($vezba['ponavljanja'] ?? 0);
                $tezina = (float)($vezba['tezina'] ?? 0);
                $trajanje = (float)($vezba['trajanje'] ?? 0);

                
                $kalorije_vezbe = $serija * $ponavljanja * $tezina * 0.1;
                $ukupno_kalorije += $kalorije_vezbe;

                $ukupno_trajanje += $trajanje;

            
                $program->vezbe()->attach($vezba['id'], [
                    'dan' => $vezba['dan'],
                    'serija' => $vezba['serija'] ?? null,
                    'ponavljanja' => $vezba['ponavljanja'] ?? null,
                    'tezina' => $vezba['tezina'] ?? null,
                    'trajanje' => $trajanje,
                    'bpm' => $vezba['bpm'] ?? null,
                ]);
            }
        }

        $intenzitet = 'Nizak';
        if ($ukupno_kalorije > 300 || $ukupno_trajanje > 45) $intenzitet = 'Srednji';
        if ($ukupno_kalorije > 500 || $ukupno_trajanje > 60) $intenzitet = 'Visok';

      
        $program->update([
            'trajanje' => $ukupno_trajanje,
            'kalorije' => $ukupno_kalorije,
            'intenzitet' => $intenzitet,
        ]);

        return response()->json($program->load('vezbe'), 201);
    }


    public function update(Request $request, $id)
    {
        $program = Program::where('korisnik_id', $request->user()->id)->findOrFail($id);

        $request->validate([
            'naziv' => 'required|string',
            'vezbe' => 'required|array',
            'vezbe.*.id' => 'required|integer|exists:vezbe,id',
            'vezbe.*.dan' => 'required|integer|min:1',
            'vezbe.*.serija' => 'nullable|integer|min:0',
            'vezbe.*.ponavljanja' => 'nullable|integer|min:0',
            'vezbe.*.tezina' => 'nullable|numeric|min:0',
            'vezbe.*.trajanje' => 'nullable|integer|min:0',
            'vezbe.*.bpm' => 'nullable|integer|min:0',
        ]);

    
        if ($request->has('naziv')) {
            $program->naziv = $request->naziv;
            $program->save();
        }

        if ($request->has('vezbe')) {
            $ukupno_trajanje = 0;
            $ukupno_kalorije = 0;
            $syncData = [];

            foreach ($request->vezbe as $vezba) {
                $serija = (float)($vezba['serija'] ?? 0);
                $ponavljanja = (float)($vezba['ponavljanja'] ?? 0);
                $tezina = (float)($vezba['tezina'] ?? 0);
                $trajanje = (float)($vezba['trajanje'] ?? 0);

                $ukupno_kalorije += $serija * $ponavljanja * $tezina * 0.1;
                $ukupno_trajanje += $trajanje;

                $syncData[$vezba['id']] = [
                    'dan' => $vezba['dan'],
                    'serija' => $vezba['serija'] ?? null,
                    'ponavljanja' => $vezba['ponavljanja'] ?? null,
                    'tezina' => $vezba['tezina'] ?? null,
                    'trajanje' => $trajanje,
                    'bpm' => $vezba['bpm'] ?? null,
                ];
            }

            $program->vezbe()->sync($syncData);

            $intenzitet = 'Nizak';
            if ($ukupno_kalorije > 300 || $ukupno_trajanje > 45) $intenzitet = 'Srednji';
            if ($ukupno_kalorije > 500 || $ukupno_trajanje > 60) $intenzitet = 'Visok';

            $program->update([
                'trajanje' => $ukupno_trajanje,
                'kalorije' => $ukupno_kalorije,
                'intenzitet' => $intenzitet,
            ]);
        }

        return response()->json($program->load('vezbe'));
    }

   
    public function destroy(Request $request, $id)
    {
        $program = Program::where('korisnik_id', $request->user()->id)->findOrFail($id);
        $program->delete();

        return response()->json(['poruka' => 'Program obrisan']);
    }
public function treneriProgrami()
{
    $programi = Program::whereHas('korisnik', function($query) {
        $query->whereHas('uloga', function($q) {
            $q->where('ime', 'trener');
        });
    })->with(['korisnik', 'vezbe'])->get();

    return response()->json($programi);
}
public function programiTrenera()
{
    return Program::whereHas('korisnik', function ($q) {
        $q->where('uloga', 'trener');
    })
    ->with([
        'vezbe',
        'korisnik:id,name'
    ])
    ->get();
}
public function sviProgramiTrenera()
    {
        $programi = Program::with('trener')->get();

        return response()->json($programi, 200);
    }

}
