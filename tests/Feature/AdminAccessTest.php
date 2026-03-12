<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Uloge;
use App\Models\Program;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class AdminAccessTest extends TestCase
{
    use RefreshDatabase;

    protected $adminUser;
    protected $regularUser;

    protected function setUp(): void
    {
        parent::setUp();

        
        $adminUloga = Uloge::create(['ime' => 'admin']);
        $userUloga = Uloge::create(['ime' => 'korisnik']);
        $this->trenerUloga = Uloge::create(['ime' => 'trener']); 

       
        $this->adminUser = User::create([
            'ime' => 'Glavni',
            'prezime' => 'Admin',
            'email' => 'admin@fitness.com',
            'username' => 'admin_boss',
            'password' => bcrypt('Password123!'),
            'pol' => 'muski',
            'datumRodjenja' => '1985-01-01',
            'uloga_id' => $adminUloga->id
        ]);

        
        $this->regularUser = User::create([
            'ime' => 'Obican',
            'prezime' => 'Korisnik',
            'email' => 'user@fitness.com',
            'username' => 'regular_joe',
            'password' => bcrypt('Password123!'),
            'pol' => 'zenski',
            'datumRodjenja' => '1995-10-10',
            'uloga_id' => $userUloga->id
        ]);
    }

    #[Test]
    public function administrator_uspesno_pristupa_listi_svih_korisnika()
    {
        
        Sanctum::actingAs($this->adminUser);
        $response = $this->getJson('/api/admin/users');
        $response->assertStatus(200);
    }

    #[Test]
    public function obican_korisnik_je_odbijen_pri_pokusaju_pristupa_admin_ruti()
    {
        
        Sanctum::actingAs($this->regularUser);
        $response = $this->getJson('/api/admin/users');
        $response->assertStatus(403);
    }

    #[Test]
    public function gost_bez_tokena_ne_moze_da_vidi_nista()
    {
        
        $response = $this->getJson('/api/admin/users');
        $response->assertStatus(401);
    }

    #[Test]
    public function administrator_ne_moze_da_vidi_privatne_programe_treninga()
    {
        
        $trener = User::create([
            'ime' => 'Milos', 
            'prezime' => 'Trener', 
            'email' => 'trener@test.com', 
            'username' => 'trener_milos',
            'password' => bcrypt('Pass123!'), 
            'uloga_id' => $this->trenerUloga->id, 
            'pol' => 'muski', 
            'datumRodjenja' => '1985-01-01'
        ]);

    
        Program::create([
            'korisnik_id' => $trener->id, 
            'naziv' => 'Topljenje masti 30 dana',
            'opis' => 'Intenzivan kardio program'
        ]);

        
        Sanctum::actingAs($this->adminUser);

        
        $response = $this->getJson('/api/programi');

        
        $response->assertStatus(200);
        
        $response->assertJsonMissing(['naziv' => 'Topljenje masti 30 dana']);
    }

    #[Test]
    public function samo_administrator_moze_da_doda_novu_vezbu()
    {
        $podaci = [
            'ime' => 'Mrtvo dizanje',
            'snimak' => 'https://www.youtube.com/watch?v=op9S0u81vKk',
            'kategorija' => 'Leđa'
        ];

        
        Sanctum::actingAs($this->regularUser);
        $responseUser = $this->postJson('/api/vezbe', $podaci);
        $responseUser->assertStatus(403);

        
        Sanctum::actingAs($this->adminUser);
        $responseAdmin = $this->postJson('/api/vezbe', $podaci);
        $responseAdmin->assertStatus(201);

        
        $this->assertDatabaseHas('vezbe', [
            'ime' => 'Mrtvo dizanje'
        ]);
    }
}