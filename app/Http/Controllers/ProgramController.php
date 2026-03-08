<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Models\Vezba;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class ProgramController extends Controller
{
    #[OA\Get(
        path: "/api/programi",
        summary: "Prikaz dostupnih programa (javni + sopstveni)",
        tags: ["Programi"],
        security: [["sanctum" => []]],
        responses: [new OA\Response(response: 200, description: "Lista programa")]
    )]
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

    #[OA\Post(
        path: "/api/programi",
        summary: "Kreiranje novog programa sa vežbama",
        tags: ["Programi"],
        security: [["sanctum" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["naziv", "vezbe", "public"],
                properties: [
                    new OA\Property(property: "naziv", type: "string"),
                    new OA\Property(property: "public", type: "boolean"),
                    new OA\Property(property: "vezbe", type: "array", items: new OA\Items(
                        properties: [
                            new OA\Property(property: "id", type: "integer"),
                            new OA\Property(property: "dan", type: "integer"),
                            new OA\Property(property: "serija", type: "integer"),
                            new OA\Property(property: "ponavljanja", type: "integer"),
                            new OA\Property(property: "tezina", type: "number"),
                            new OA\Property(property: "trajanje", type: "integer"),
                            new OA\Property(property: "bpm", type: "integer")
                        ]
                    ))
                ]
            )
        ),
        responses: [new OA\Response(response: 201, description: "Program kreiran")]
    )]
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

    #[OA\Put(
        path: "/api/programi/{id}",
        summary: "Ažuriranje programa",
        tags: ["Programi"],
        security: [["sanctum" => []]],
        parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
        responses: [new OA\Response(response: 200, description: "Program ažuriran")]
    )]
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

    #[OA\Get(
        path: "/api/programi/treneri",
        summary: "Programi trenera (zavisi da li korisnik ima trenera)",
        tags: ["Programi"],
        security: [["sanctum" => []]],
        responses: [new OA\Response(response: 200, description: "Lista programa")]
    )]
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

    #[OA\Delete(
        path: "/api/programi/{id}",
        summary: "Brisanje sopstvenog programa",
        tags: ["Programi"],
        security: [["sanctum" => []]],
        parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
        responses: [new OA\Response(response: 200, description: "Obrisano")]
    )]
    public function destroy($id)
    {
        // Pronađemo program koji pripada trenutno prijavljenom korisniku
        $program = Program::where('korisnik_id', auth()->id())->find($id);

        if (!$program) {
            return response()->json(['message' => 'Program ne postoji ili nije vaš'], 404);
        }

        // Brisanje veza sa vezbama u pivot tabeli
        $program->vezbe()->detach();

        // Brisanje samog programa
        $program->delete();

        return response()->json(['message' => 'Program uspešno obrisan']);
    }

    #[OA\Get(
        path: "/api/programi/moji",
        summary: "Prikaz svih programa koje je kreirao ulogovani korisnik",
        tags: ["Programi"],
        security: [["sanctum" => []]],
        responses: [new OA\Response(response: 200, description: "Lista mojih programa")]
    )]
    public function mojiProgrami(Request $request)
    {
        $userId = $request->user()->id;

        $programi = Program::where('korisnik_id', $userId)
            ->with('vezbe', 'korisnik')
            ->get();

        return response()->json($programi);
    }

    #[OA\Post(
        path: "/api/programi/dodaj-veze",
        summary: "Brzo kreiranje 'Trening trenera' programa",
        tags: ["Programi"],
        security: [["sanctum" => []]],
        responses: [new OA\Response(response: 201, description: "Program dodat")]
    )]
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