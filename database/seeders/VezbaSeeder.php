<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Vezba;
use Illuminate\Support\Facades\File;

class VezbaSeeder extends Seeder
{
    public function run(): void
    {
        // Putanja do tvog CSV fajla
        $csvFile = database_path('data/vezbe.csv');
        
        // Provera da li fajl postoji
        if (!File::exists($csvFile)) {
            $this->command->error("Fajl nije pronađen na putanji: $csvFile");
            return;
        }

        $file = fopen($csvFile, 'r');
        $header = fgetcsv($file); 

        while (($data = fgetcsv($file)) !== FALSE) {
            Vezba::create([
                'ime'        => trim($data[0], " \t\n\r\0\x0B\""),
                'snimak'     => trim($data[1], " \t\n\r\0\x0B\""),
                'kategorija' => trim($data[2], " \t\n\r\0\x0B\""),
            ]);
        }

        fclose($file);
        $this->command->info("Uspešno uvezeno 19 vežbi iz CSV fajla.");
    }
}