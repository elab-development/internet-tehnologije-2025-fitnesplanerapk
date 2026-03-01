<?php

namespace App\Http\Controllers;

use App\Models\Obrok;
use App\Models\Hrana;
use App\Models\ObrokHrana;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use OpenApi\Annotations as OA; 
class ObrokController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/obroci",
     *     summary="Lista svih obroka korisnika",
     *     tags={"Obroci"},
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Lista obroka",
     *         @OA\JsonContent(type="array", @OA\Items(
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="naziv", type="string", example="Doručak"),
     *             @OA\Property(property="kalorije", type="integer", example=500)
     *         ))
     *     )
     * )
     */
    public function index(Request $request)
    {
        $datum = $request->query('datum');
        $userId = auth()->id();

        if (!$userId) {
            return response()->json(['message' => 'Korisnik nije ulogovan'], 401);
        }

        $obroci = Obrok::with('hrana.hrana')
            ->where('user_id', $userId)
            ->where('datum', $datum)
            ->get();

        $ukupnoKalorija = 0;
        foreach ($obroci as $obrok) {
            foreach ($obrok->hrana as $h) {
                $ukupnoKalorija += $h->kalorije;
            }
        }

        return response()->json([
            'datum' => $datum,
            'ukupno_kalorija' => $ukupnoKalorija,
            'obroci' => $obroci
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/obroci",
     *     summary="Dodavanje novog obroka",
     *     tags={"Obroci"},
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"naziv","kalorije"},
     *             @OA\Property(property="naziv", type="string", example="Doručak"),
     *             @OA\Property(property="kalorije", type="integer", example=500)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Obrok uspešno dodat"
     *     )
     * )
     */
    public function store(Request $request)
    {
        $request->validate([
            'datum' => 'required|date',
            'naziv' => 'required|string',
            'namirnice' => 'required|array|min:1',
            'namirnice.*.kolicina' => 'required|numeric|min:1',
            'namirnice.*.custom_naziv' => 'nullable|string',
            'namirnice.*.kalorije_na_100g' => 'nullable|numeric|min:0',
            'namirnice.*.hrana_id' => 'nullable|exists:hrana,id',
        ]);

        $userId = auth()->id();
        if (!$userId) {
            return response()->json(['message' => 'Korisnik nije ulogovan'], 401);
        }

        $obrok = Obrok::create([
            'user_id' => $userId,
            'datum' => $request->datum,
            'naziv' => $request->naziv,
        ]);

        foreach ($request->namirnice as $n) {
            if (!empty($n['hrana_id'])) {
                $hrana = Hrana::findOrFail($n['hrana_id']);
                $kalorije = round(($hrana->kalorije / 100) * $n['kolicina']);
                $custom_naziv = null;
                $hrana_id = $hrana->id;
            } else {
                $custom_naziv = $n['custom_naziv'] ?? 'Nepoznato';
                $kalorije_na_100g = $n['kalorije_na_100g'] ?? 0;

                $newHrana = Hrana::create([
                    'naziv' => $custom_naziv,
                    'kalorije' => $kalorije_na_100g,
                ]);

                $hrana_id = $newHrana->id;
                $kalorije = round(($kalorije_na_100g / 100) * $n['kolicina']);
            }

            ObrokHrana::create([
                'obrok_id' => $obrok->id,
                'hrana_id' => $hrana_id,
                'prilagodjena_hrana' => $custom_naziv,
                'kolicina' => $n['kolicina'],
                'kalorije' => $kalorije,
            ]);
        }

        return response()->json([
            'message' => 'Obrok uspešno dodat',
            'obrok_id' => $obrok->id,
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/obroci/{id}",
     *     summary="Prikaz jednog obroka",
     *     tags={"Obroci"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Detalji obroka"
     *     )
     * )
     */
    public function show($id)
    {
        $obrok = Obrok::with('hrana.hrana')
            ->where('user_id', auth()->id())
            ->findOrFail($id);

        $namirnice = $obrok->hrana->map(function ($h) {
            return [
                'id' => $h->id,
                'hrana_id' => $h->hrana_id,
                'custom_naziv' => $h->prilagodjena_hrana,
                'kolicina' => $h->kolicina,
                'kalorije_na_100g' => $h->hrana->kalorije ?? 0,
                'kalorije' => $h->kalorije
            ];
        });

        return response()->json([
            'id' => $obrok->id,
            'datum' => $obrok->datum,
            'naziv' => $obrok->naziv,
            'namirnice' => $namirnice
        ]);
    }

    /**
     * @OA\Put(
     *     path="/api/obroci/{obrok}",
     *     summary="Update obroka",
     *     tags={"Obroci"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="obrok",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="naziv", type="string", example="Doručak"),
     *             @OA\Property(property="kalorije", type="integer", example=500)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Obrok uspešno izmenjen"
     *     )
     * )
     */
    public function update(Request $request, Obrok $obrok)
    {
        if ($obrok->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'datum' => 'sometimes|date',
            'naziv' => 'sometimes|string',
            'namirnice' => 'required|array|min:1',
            'namirnice.*.id' => 'nullable|exists:obrok_hrana,id',
            'namirnice.*.hrana_id' => 'nullable|exists:hrana,id',
            'namirnice.*.custom_naziv' => 'nullable|string',
            'namirnice.*.kolicina' => 'required|numeric|min:1',
            'namirnice.*.kalorije_na_100g' => 'nullable|numeric|min:0',
        ]);

        $data = [];
        if ($request->filled('datum')) $data['datum'] = $request->datum;
        if ($request->filled('naziv')) $data['naziv'] = $request->naziv;
        if (!empty($data)) $obrok->update($data);

        $postojeciIds = $obrok->hrana()->pluck('id')->toArray();
        $poslatiIds = [];

        foreach ($request->namirnice as $n) {
            if (!empty($n['id'])) {
                $obrokHrana = ObrokHrana::where('id', $n['id'])
                    ->where('obrok_id', $obrok->id)
                    ->first();

                if (!$obrokHrana) continue;
                $poslatiIds[] = $obrokHrana->id;

                if (!empty($n['hrana_id'])) {
                    $hrana = Hrana::findOrFail($n['hrana_id']);
                    $kalorije = round(($hrana->kalorije / 100) * $n['kolicina']);
                } else {
                    $kalorije_na_100g = $n['kalorije_na_100g'] ?? 0;
                    $kalorije = round(($kalorije_na_100g / 100) * $n['kolicina']);
                }

                $obrokHrana->update([
                    'hrana_id' => $n['hrana_id'] ?? $obrokHrana->hrana_id,
                    'prilagodjena_hrana' => $n['custom_naziv'] ?? $obrokHrana->prilagodjena_hrana,
                    'kolicina' => $n['kolicina'],
                    'kalorije' => $kalorije,
                ]);
            } else {
                if (!empty($n['hrana_id'])) {
                    $hrana = Hrana::findOrFail($n['hrana_id']);
                    $kalorije = round(($hrana->kalorije / 100) * $n['kolicina']);
                    $hrana_id = $hrana->id;
                    $custom_naziv = null;
                } else {
                    $newHrana = Hrana::create([
                        'naziv' => $n['custom_naziv'] ?? 'Nepoznato',
                        'kalorije' => $n['kalorije_na_100g'] ?? 0
                    ]);
                    $hrana_id = $newHrana->id;
                    $custom_naziv = $n['custom_naziv'];
                    $kalorije = round(($n['kalorije_na_100g'] / 100) * $n['kolicina']);
                }

                $nova = ObrokHrana::create([
                    'obrok_id' => $obrok->id,
                    'hrana_id' => $hrana_id,
                    'prilagodjena_hrana' => $custom_naziv,
                    'kolicina' => $n['kolicina'],
                    'kalorije' => $kalorije,
                ]);

                $poslatiIds[] = $nova->id;
            }
        }

        $zaBrisanje = array_diff($postojeciIds, $poslatiIds);
        if (!empty($zaBrisanje)) {
            ObrokHrana::whereIn('id', $zaBrisanje)->delete();
        }

        return response()->json([
            'message' => 'Obrok uspešno ažuriran'
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/obroci/{obrok}",
     *     summary="Brisanje obroka",
     *     tags={"Obroci"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="obrok",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Obrok uspešno obrisan"
     *     )
     * )
     */
    public function destroy(Obrok $obrok)
    {
        if ($obrok->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $obrok->hrana()->delete();
        $obrok->delete();

        return response()->json([
            'message' => 'Obrok uspešno obrisan'
        ]);
    }

    public function pregled()
    {
        $userId = auth()->id();

        $dnevniObroci = Obrok::with('hrana.hrana')
            ->where('user_id', $userId)
            ->orderBy('datum', 'desc')
            ->get()
            ->groupBy('datum')
            ->map(function($obroci, $datum) {
                $ukupno = 0;
                $obrociData = $obroci->map(function($obrok) use (&$ukupno) {
                    $kalorije = $obrok->hrana->sum('kalorije');
                    $ukupno += $kalorije;
                    return [
                        'id' => $obrok->id,
                        'naziv' => $obrok->naziv,
                        'hrana' => $obrok->hrana,
                    ];
                });
                return [
                    'datum' => $datum,
                    'ukupno_kalorija' => $ukupno,
                    'obroci' => $obrociData,
                ];
            })
            ->values();

        return response()->json($dnevniObroci);
    }

    public function obrociPregled(Request $request)
    {
        $od = $request->query('od'); 
        $do = $request->query('do'); 

        $query = Obrok::with('hrana.hrana')->where('user_id', auth()->id());

        if ($od) $query->where('datum', '>=', $od);
        if ($do) $query->where('datum', '<=', $do);

        $obroci = $query->orderBy('datum', 'desc')->get();

        $dnevniObroci = $obroci->groupBy('datum')->map(function ($obrociZaDatum, $datum) {
            $ukupnoKalorija = 0;

            $obrociArray = $obrociZaDatum->map(function ($obrok) use (&$ukupnoKalorija) {
                foreach ($obrok->hrana as $h) {
                    $ukupnoKalorija += $h->kalorije;
                }

                return [
                    'id' => $obrok->id,
                    'naziv' => $obrok->naziv,
                    'hrana' => $obrok->hrana->map(function ($h) {
                        return [
                            'custom_naziv' => $h->custom_naziv,
                            'kalorije' => $h->kalorije,
                            'hrana' => $h->hrana,
                        ];
                    }),
                ];
            });

            return [
                'datum' => $datum,
                'ukupno_kalorija' => $ukupnoKalorija,
                'obroci' => $obrociArray,
            ];
        })->values();
              
        return response()->json($dnevniObroci);
    }
}