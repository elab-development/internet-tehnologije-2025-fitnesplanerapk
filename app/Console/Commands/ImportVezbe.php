<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use App\Models\Vezba;
class ImportVezbe extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
   protected $signature = 'import:vezbe';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
{
    $offset = 0;
    $limit = 200;
    $total = 1; // samo da uđe u while

    while ($offset < $total) {
        $response = Http::get('https://wger.de/api/v2/exerciseinfo/', [
            'language' => 2, // English
            'limit' => $limit,
            'offset' => $offset
        ])->json();

        $total = $response['count']; // ukupno vežbi na API-u
foreach ($response['results'] as $exercise) {

    $naziv = $exercise['name'] ?? null;
    $opis = isset($exercise['description']) ? strip_tags($exercise['description']) : null;

    // mišić (prvi ako postoji)
    $muscle = null;
    if (!empty($exercise['muscles']) && is_array($exercise['muscles'])) {
        $muscle = $exercise['muscles'][0] ?? null; // ovo je ID, možda će kasnije trebati mapirati na ime
    }

    // slika
    $image = null;
    if (!empty($exercise['images']) && is_array($exercise['images'])) {
        $image = $exercise['images'][0]['image'] ?? null;
    }

    // samo ako postoji naziv
    if ($naziv) {
        Vezba::updateOrCreate(
            ['naziv_en' => $naziv],
            [
                'opis' => $opis,
                'misic' => $muscle,
                'slika' => $image,
                'naziv_sr' => null,
                'video' => null
            ]
        );
    }
}

        $offset += $limit;
        $this->info("Importovano $offset / $total vežbi...");
    }

    $this->info('Sve vežbe su importovane!');
}
}
