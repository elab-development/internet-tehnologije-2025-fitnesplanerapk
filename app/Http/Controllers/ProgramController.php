<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Models\Vezba;
use Illuminate\Http\Request;

class ProgramController extends Controller
{
    // Lista svih programa za korisnika
    public function index(Request $request)
    {
        return Program::where('korisnik_id', $request->user()->id)
            ->with('vezbe') 
            ->get();
    }

    // Kreiranje novog programa
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

        // Kreiramo program sa osnovnim podacima
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

                // Računanje kalorija po vežbi: serija * ponavljanja * tezina * faktor
                $kalorije_vezbe = $serija * $ponavljanja * $tezina * 0.1;
                $ukupno_kalorije += $kalorije_vezbe;

                $ukupno_trajanje += $trajanje;

                // Pivot tabela program_vezba
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

        // Određivanje intenziteta programa
        $intenzitet = 'Nizak';
        if ($ukupno_kalorije > 300 || $ukupno_trajanje > 45) $intenzitet = 'Srednji';
        if ($ukupno_kalorije > 500 || $ukupno_trajanje > 60) $intenzitet = 'Visok';

        // Ažuriramo program sa izračunatim vrednostima
        $program->update([
            'trajanje' => $ukupno_trajanje,
            'kalorije' => $ukupno_kalorije,
            'intenzitet' => $intenzitet,
        ]);

        return response()->json($program->load('vezbe'), 201);
    }

    // Ažuriranje programa
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

        // Ažuriramo naziv ako postoji
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

    // Brisanje programa
    public function destroy(Request $request, $id)
    {
        $program = Program::where('korisnik_id', $request->user()->id)->findOrFail($id);
        $program->delete();

        return response()->json(['poruka' => 'Program obrisan']);
    }
}
