<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class DefaultKategorijeSeeder extends Seeder
{
   

public function run()
{
    $defaultCategories = [
        'Grudi',
        'Leđa',
        'Noge',
        'Ramena',
        'Ruke',
        'Stomak',
        'Kardio',
        'Full body',
        'Ostalo'
    ];

    foreach ($defaultCategories as $category) {
        DB::table('vezbe')
            ->whereNull('kategorija')
            ->inRandomOrder()
            ->limit(1)
            ->update(['kategorija' => $category]);
    }
}
    
}
