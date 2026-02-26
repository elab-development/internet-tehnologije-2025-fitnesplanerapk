<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KategorijeSeeder extends Seeder
{
    public function run()
    {
        $kategorije = [
            ['naziv' => 'Grudi'],
            ['naziv' => 'Leđa'],
            ['naziv' => 'Ramena'],
            ['naziv' => 'Noge'],
            ['naziv' => 'Ruke'],
            ['naziv' => 'Core'],
            ['naziv' => 'Full Body'],
            ['naziv' => 'Gimnastika'],
            ['naziv' => 'Kardio'],
        ];

        foreach ($kategorije as $k) {
            DB::table('kategorije')->insert([
                'naziv' => $k['naziv'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}