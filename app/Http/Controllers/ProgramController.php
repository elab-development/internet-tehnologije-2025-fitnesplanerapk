<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Models\Vezba;
use Illuminate\Http\Request;

class ProgramController extends Controller
{
    // Prikaz programa koji korisnik može da vidi
    public function index(Request $request)
    {
        // Prikazujemo:
        // - public programe svih trenera
        // - private programe samo za korisnika koji je vlasnik/trener
        $userId = $request->user()->id;

        $programi = Program::where(function($query) use ($userId) {
            $query->where('public', true) // svi javni
                  ->orWhere('korisnik_id', $userId); // ili vlasnik
        })->with('vezbe', 'korisnik')->get();

        return response()->json($programi);
    }

    // Kreiranje programa
public function store(Request $request)
{
    $request->validate([
        'naziv' => 'required|string',
        'vezbe' => 'required|array',
        'vezbe.*.id' => 'required|integer|exists:vezbe,id',
        'vezbe.*.dan' => 'nullable|integer|min:1', // više nije required
        'vezbe.*.serija' => 'nullable|integer|min:0',
        'vezbe.*.ponavljanja' => 'nullable|integer|min:0',
        'vezbe.*.tezina' => 'nullable|numeric|min:0',
        'vezbe.*.trajanje' => 'nullable|integer|min:0',
        'vezbe.*.bpm' => 'nullable|integer|min:0',
        'public' => 'required|boolean',
    ]);

    $program = Program::create([
        'naziv' => $request->naziv,
        'korisnik_id' => auth()->id(),
        'public' => $request->public,
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
                'dan' => $vezba['dan'] ?? 1, // default dan = 1 ako nije unet
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

// Update programa
public function update(Request $request, $id)
{
    $program = Program::where('korisnik_id', $request->user()->id)->findOrFail($id);

    $request->validate([
        'naziv' => 'required|string',
        'vezbe' => 'required|array',
        'vezbe.*.id' => 'required|integer|exists:vezbe,id',
        'vezbe.*.dan' => 'nullable|integer|min:1', // više nije required
        'vezbe.*.serija' => 'nullable|integer|min:0',
        'vezbe.*.ponavljanja' => 'nullable|integer|min:0',
        'vezbe.*.tezina' => 'nullable|numeric|min:0',
        'vezbe.*.trajanje' => 'nullable|integer|min:0',
        'vezbe.*.bpm' => 'nullable|integer|min:0',
        'public' => 'required|boolean',
    ]);

    $program->naziv = $request->naziv;
    $program->public = $request->public;
    $program->save();

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
                'dan' => $vezba['dan'] ?? 1, // default dan = 1
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
public function treneriProgrami(Request $request)
{
    $user = $request->user();

    if ($user->trener_id) {
        // Korisnik ima svog trenera -> prikazujemo public + private treninzi tog trenera
        $programi = Program::where('korisnik_id', $user->trener_id)
            ->with('vezbe', 'korisnik')
            ->get();
    } else {
        // Korisnik nema trenera -> prikazujemo samo public treninge svih trenera
        $programi = Program::where('public', true)
            ->with('vezbe', 'korisnik')
            ->get();
    }

    return response()->json($programi);
}
public function dodajVezbe(Request $request)
{
    $user = $request->user();

    $request->validate([
        'vezbe' => 'required|array',
        'vezbe.*.id' => 'required|integer|exists:vezbe,id',
        'vezbe.*.serija' => 'nullable|integer|min:0',
        'vezbe.*.ponavljanja' => 'nullable|integer|min:0',
        'vezbe.*.tezina' => 'nullable|numeric|min:0',
        'vezbe.*.trajanje' => 'nullable|integer|min:0',
        'vezbe.*.bpm' => 'nullable|integer|min:0',
        'vezbe.*.dan' => 'nullable|integer|min:1',
    ]);

    $program = Program::create([
        'naziv' => 'Trening trenera',
        'korisnik_id' => $user->id,
        'public' => false,
    ]);

    $ukupno_trajanje = 0;
    $ukupno_kalorije = 0;

    foreach ($request->vezbe as $v) {
        $serija = (float)($v['serija'] ?? 0);
        $ponavljanja = (float)($v['ponavljanja'] ?? 0);
        $tezina = (float)($v['tezina'] ?? 0);
        $trajanje = (float)($v['trajanje'] ?? 0);

        $kalorije_vezbe = $serija * $ponavljanja * $tezina * 0.1;
        $ukupno_kalorije += $kalorije_vezbe;
        $ukupno_trajanje += $trajanje;

        $program->vezbe()->attach($v['id'], [
            'dan' => $v['dan'] ?? 1,
            'serija' => $v['serija'] ?? null,
            'ponavljanja' => $v['ponavljanja'] ?? null,
            'tezina' => $v['tezina'] ?? null,
            'trajanje' => $trajanje,
            'bpm' => $v['bpm'] ?? null,
        ]);
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
}