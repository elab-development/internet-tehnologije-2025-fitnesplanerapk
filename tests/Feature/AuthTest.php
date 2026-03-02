<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Uloge;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    /**
     * SetUp metoda se pokreće pre svakog testa.
     * Ovde govorimo Laravelu da ignoriše Vite manifest.
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function korisnik_moze_da_se_registruje()
    {
        // PRIPREMA: Kreiramo ulogu koja je neophodna kontroleru
        Uloge::create(['ime' => 'korisnik']);

        $podaci = [
            'ime' => 'Tina',
            'prezime' => 'Nadic',
            'email' => 'tina@example.com',
            'username' => 'tinan',
            'password' => 'password123!',
            'password_confirmation' => 'password123!', // Dodaj ako tvoj RegisterRequest zahteva potvrdu
            'pol' => 'zenski',
            'datumRodjenja' => '2006-03-01',
            'uloga' => 'korisnik'
        ];

        $response = $this->postJson('/api/register', $podaci);

        // Provera statusa 201
        $response->assertStatus(201);

        // Provera baze
        $this->assertDatabaseHas('users', [
            'email' => 'tina@example.com',
            'username' => 'tinan'
        ]);

        // Provera JSON strukture
        $response->assertJsonStructure([
            'user' => ['id', 'ime', 'email', 'username', 'pol', 'datumRodjenja'],
            'token'
        ]);
    }

    /** @test */
    public function korisnik_moze_da_se_uloguje()
    {
        // PRIPREMA
        $uloga = Uloge::create(['ime' => 'korisnik']);
        
        $user = User::create([
            'ime' => 'Test',
            'prezime' => 'User',
            'email' => 'test@example.com',
            'username' => 'testuser',
            'password' => bcrypt('password123!'),
            'pol' => 'muski',
            'datumRodjenja' => '1990-01-01',
            'uloga_id' => $uloga->id
        ]);

        $response = $this->postJson('/api/login', [
            'username' => 'testuser',
            'password' => 'password123!'
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['user', 'token']);
    }

    // /** @test */
    // public function korisnik_moze_da_se_odjavi()
    // {
    //     // PRIPREMA
    //     $uloga = Uloge::create(['ime' => 'korisnik']);
    //     $user = User::create([
    //         'ime' => 'Test', 
    //         'prezime' => 'User', 
    //         'email' => 't@t.com', 
    //         'username' => 't', 
    //         'password' => bcrypt('123'),
    //         'pol' => 'zenski', 
    //         'datumRodjenja' => '2000-01-01', 
    //         'uloga_id' => $uloga->id
    //     ]);

    //     $token = $user->createToken('test')->plainTextToken;

    //     // AKCIJA: Slanje tokena u zaglavlju
    //     $response = $this->withHeader('Authorization', 'Bearer ' . $token)
    //                      ->postJson('/api/logout');

    //     // PROVERA: Tvoj kontroler vraća 204 za logout
    //     $response->assertStatus(204);
    // }
}