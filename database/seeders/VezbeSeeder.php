<?php

namespace Database\Seeders;
use Stichoza\GoogleTranslate\GoogleTranslate;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VezbeSeeder extends Seeder
{
    public function run()
    {
        $kategorije = DB::table('kategorije')->pluck('id', 'naziv');

        $path = database_path('data/vezbe.csv');

        if (!file_exists($path)) {
            $this->command->error("CSV fajl ne postoji!");
            return;
        }

        $file = fopen($path, 'r');

        fgetcsv($file); // preskoči header red

        while (($row = fgetcsv($file)) !== false) {

            $ime_en = trim($row[0], '"');
            $url = trim($row[1], '"');

            // očisti youtube link (ukloni &list i ostalo)
            $videoId = explode('watch?v=', $url)[1] ?? null;
            $videoId = explode('&', $videoId)[0] ?? null;

            $cleanUrl = "https://www.youtube.com/watch?v=" . $videoId;

            // AUTOMATSKA KATEGORIZACIJA
            $kategorijaNaziv = $this->odrediKategoriju($ime_en);

            DB::table('vezbe')->insert([
                'ime_en' => $ime_en,
                'ime_sr' => $this->prevediNaziv($ime_en),
                'snimak' => $cleanUrl,
                'kategorija_id' => $kategorije[$kategorijaNaziv] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        fclose($file);
    }

    private function odrediKategoriju($ime)
    {
        $ime = strtolower($ime);

        if (str_contains($ime, 'squat') || str_contains($ime, 'lunge') || str_contains($ime, 'jump'))
            return 'Noge';

        if (str_contains($ime, 'press') || str_contains($ime, 'push'))
            return 'Ramena';

        if (str_contains($ime, 'deadlift') || str_contains($ime, 'pull'))
            return 'Leđa';

        if (str_contains($ime, 'burpee') || str_contains($ime, 'snatch') || str_contains($ime, 'clean'))
            return 'Full Body';

        if (str_contains($ime, 'sit') || str_contains($ime, 'core') || str_contains($ime, 'l-sit'))
            return 'Core';

        return 'Gimnastika';
    }



private $prevodiCache = [];

private function prevediNaziv($ime)
{
    if(isset($this->prevodiCache[$ime])) {
        return $this->prevodiCache[$ime];
    }

    $tr = new GoogleTranslate('sr');
    try {
        $prevod = $tr->translate($ime);
        $this->prevodiCache[$ime] = $prevod;
        return $prevod;
    } catch (\Exception $e) {
        return $ime;
    }
}
}