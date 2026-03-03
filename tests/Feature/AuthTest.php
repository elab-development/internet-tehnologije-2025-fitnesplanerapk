<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Uloge;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    
    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function korisnik_moze_da_se_registruje()
    {
        
        Uloge::create(['ime' => 'korisnik']);

        $podaci = [
            'ime' => 'Tina',
            'prezime' => 'Nadic',
            'email' => 'tina@example.com',
            'username' => 'tinan',
            'password' => 'password123!',
            'password_confirmation' => 'password123!',
            'pol' => 'zenski',
            'datumRodjenja' => '2006-03-01',
            'uloga' => 'korisnik'
        ];

        $response = $this->postJson('/api/register', $podaci);

       
        $response->assertStatus(201);

       
        $this->assertDatabaseHas('users', [
            'email' => 'tina@example.com',
            'username' => 'tinan'
        ]);

        
        $response->assertJsonStructure([
            'user' => ['id', 'ime', 'email', 'username', 'pol', 'datumRodjenja'],
            'token'
        ]);
    }

    /** @test */
    public function korisnik_moze_da_se_uloguje()
    {
        
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

    
}