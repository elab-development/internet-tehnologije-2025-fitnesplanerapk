<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Uloge;
use App\Models\Hrana;
use App\Models\Obrok;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class FitnessDataTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        
        
        $uloga = Uloge::create(['ime' => 'korisnik']);
        $this->user = User::create([
            'ime' => 'Test', 'prezime' => 'User', 'email' => 'test@example.com',
            'username' => 'testuser', 'password' => bcrypt('Password123!'),
            'pol' => 'muski', 'datumRodjenja' => '1990-01-01', 'uloga_id' => $uloga->id
        ]);

        Sanctum::actingAs($this->user);
    }

    #[Test]
    public function kontroler_tacno_racuna_bmi_pri_cuvanju()
    {
        $podaci = [
            'date' => '2025-01-01',
            'tezina' => 90,
            'visina' => 185, // 1.85m
            'masti' => 20,
            'misici' => 40,
            'obim_struka' => 95
        ];

        
        $response = $this->postJson('/api/parametri', $podaci);

        $response->assertStatus(201);
        
     
        $this->assertDatabaseHas('parametri', [
            'user_id' => $this->user->id,
            'bmi' => 26.30 
        ]);
    }

    #[Test]
    public function korisnik_moze_da_obrise_svoj_cilj()
    {
       
        $cilj = \App\Models\Cilj::create([
            'user_id' => $this->user->id,
            'hidriranost' => 2,
            'tezina' => 80,
            'kalorije' => 2000
        ]);

        
        $response = $this->deleteJson("/api/cilj/{$cilj->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('cilj', ['id' => $cilj->id]);
    }

    #[Test]
    public function kreiranje_obroka_automatski_pravi_novu_hranu_ako_nije_izabrana_postojeca()
    {
        $podaci = [
            'datum' => '2025-05-05',
            'naziv' => 'Uzina',
            'namirnice' => [
                [
                    'custom_naziv' => 'Moja Domaca Pita',
                    'kolicina' => 200,
                    'kalorije_na_100g' => 300
                ]
            ]
        ];

        $response = $this->postJson('/api/obroci', $podaci);

        $response->assertStatus(200);
        
        
        $this->assertDatabaseHas('hrana', [
            'naziv' => 'Moja Domaca Pita',
            'kalorije' => 300
        ]);

        
        $this->assertDatabaseHas('obrok_hrana', [
            'kolicina' => 200,
            'kalorije' => 600
        ]);
    }

    

    #[Test]
    public function korisnik_moze_da_vidi_listu_svih_vezbi()
    {
        
        \App\Models\Vezba::create([
            'ime' => 'Sklekovi',
            'snimak' => 'https://video.com/1',
            'kategorija' => 'Grudi'
        ]);

        \App\Models\Vezba::create([
            'ime' => 'Zgibovi',
            'snimak' => 'https://video.com/2',
            'kategorija' => 'Leđa'
        ]);

        $response = $this->getJson('/api/vezbe');

        $response->assertStatus(200)
                 ->assertJsonCount(2); 
    }
}