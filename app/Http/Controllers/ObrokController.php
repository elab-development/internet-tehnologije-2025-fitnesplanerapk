<?php

namespace App\Http\Controllers;

use App\Models\Obrok;
use App\Models\Hrana;
use App\Models\ObrokHrana;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ObrokController extends Controller
{
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
   
public function pregled() {
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

    $query = Obrok::with('hrana.hrana') 
        ->where('user_id', auth()->id());

    if ($od) {
        $query->where('datum', '>=', $od);
    }
    if ($do) {
        $query->where('datum', '<=', $do);
    }

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
