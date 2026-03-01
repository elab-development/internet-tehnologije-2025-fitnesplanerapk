<?php

namespace App\Http\Controllers;
use OpenApi\Annotations as OA; 
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Barryvdh\DomPDF\Facade\Pdf; // Ako koristiš dompdf
use App\Models\Parametri; 
use App\Models\Hidriranost;
use App\Models\Cilj;


class EmailController extends Controller
{
    /**
 * @OA\Post(
 *     path="/api/posalji-izvestaj",
 *     summary="Slanje PDF izveštaja korisniku",
 *     tags={"Email"},
 *     security={{"sanctum":{}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"user_id"},
 *             @OA\Property(property="user_id", type="integer", example=5)
 *         )
 *     ),
 *     @OA\Response(response=200, description="PDF izveštaj poslat")
 * )
 */
    public function posaljiPdf(Request $request)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'Korisnik nije autorizovan'], 401);
            }

            // Uzmi poslednjih 10 parametara korisnika
            $podaciParametri = Parametri::where('user_id', $user->id)
                ->orderBy('date', 'asc')
                ->take(10)
                ->get();

            // Uzmi poslednjih 10 unosa vode
            $podaciVoda = Hidriranost::where('user_id', $user->id)
                ->orderBy('datum', 'asc')
                ->take(10)
                ->get();

            // Priprema podataka za grafikone
            $pLabels = $podaciParametri->pluck('date')->map(fn($d) => date('d.m', strtotime($d)))->toArray();
            $pTezina = $podaciParametri->pluck('tezina')->toArray();
            $pMasti = $podaciParametri->pluck('masti')->toArray();
            $pMisici = $podaciParametri->pluck('misici')->toArray();

            $hLabels = $podaciVoda->pluck('datum')->map(fn($d) => date('d.m', strtotime($d)))->toArray();
            $hVoda = $podaciVoda->pluck('ukupno')->toArray();

            // Grafikon težine
            $chartTezina = [
                'type' => 'line',
                'data' => [
                    'labels' => $pLabels,
                    'datasets' => [[
                        'label' => 'Težina (kg)',
                        'data' => $pTezina,
                        'borderColor' => '#EF4444',
                        'backgroundColor' => 'rgba(239, 68, 68, 0.1)',
                        'fill' => true
                    ]]
                ]
            ];

            // Grafikon unosa vode
            $chartVoda = [
                'type' => 'bar',
                'data' => [
                    'labels' => $hLabels,
                    'datasets' => [[
                        'label' => 'Unos vode (L)',
                        'data' => $hVoda,
                        'backgroundColor' => '#3B82F6'
                    ]]
                ]
            ];

            // Grafikon masti i mišića
            $chartSastav = [
                'type' => 'line',
                'data' => [
                    'labels' => $pLabels,
                    'datasets' => [
                        [
                            'label' => 'Masti (%)',
                            'data' => $pMasti,
                            'borderColor' => '#F59E0B',
                            'fill' => false
                        ],
                        [
                            'label' => 'Mišići (%)',
                            'data' => $pMisici,
                            'borderColor' => '#10B981',
                            'fill' => false
                        ]
                    ]
                ]
            ];

            // URL-ovi grafikona
            $urlTezina = "https://quickchart.io/chart?c=" . urlencode(json_encode($chartTezina));
            $urlVoda = "https://quickchart.io/chart?c=" . urlencode(json_encode($chartVoda));
            $urlSastav = "https://quickchart.io/chart?c=" . urlencode(json_encode($chartSastav));

            $data = [
                'ime' => $user->ime,
                'prezime' => $user->prezime,
                'datum' => now()->format('d.m.Y'),
                'chartTezinaUrl' => $urlTezina,
                'chartVodaUrl' => $urlVoda,
                'chartSastavUrl' => $urlSastav
            ];

            // Generiši PDF
            $pdf = Pdf::loadView('pdf.izvestaj', $data)
                      ->setOption('isRemoteEnabled', true)
                      ->setOption('chroot', public_path());

            // Pošalji mejl sa PDF-om
            Mail::send('emails.poruka', $data, function($message) use ($user, $pdf) {
                $message->to($user->email)
                        ->subject('Vaš Personalizovani Fitness Izveštaj')
                        ->attachData($pdf->output(), "fitness_izvestaj_" . now()->format('d_m_Y') . ".pdf");
            });

            return response()->json(['message' => 'Izveštaj sa grafikonima je uspešno poslat!']);

        } catch (\Exception $e) {
            return response()->json([
                'greska' => $e->getMessage(),
                'linija' => $e->getLine(),
                'fajl' => $e->getFile()
            ], 500);
        }
    }
}