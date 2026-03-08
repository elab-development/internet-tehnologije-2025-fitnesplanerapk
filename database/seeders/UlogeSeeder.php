<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Uloge;

class UlogeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $uloge = ['korisnik', 'admin', 'trener'];

        foreach ($uloge as $ime) {
            // Ako uloga već postoji, preskoči
            Uloge::firstOrCreate(['ime' => $ime]);
        }
    }
}