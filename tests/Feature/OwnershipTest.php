<?php

namespace Tests\Feature;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Uloge;
use App\Models\Cilj;
use App\Models\Parametri;
use App\Models\Obrok;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class OwnershipTest extends TestCase
{
    use RefreshDatabase;

    protected $korisnikA;
    protected $korisnikB;

    protected function setUp(): void
    {
        parent::setUp();

        $uloga = Uloge::create(['ime' => 'korisnik']);

        
        $this->korisnikA = User::create([
            'ime' => 'Korisnik', 'prezime' => 'A', 'email' => 'a@test.com', 'username' => 'usera',
            'password' => bcrypt('Pass123!'), 'uloga_id' => $uloga->id, 'pol' => 'muski', 'datumRodjenja' => '1990-01-01'
        ]);

        $this->korisnikB = User::create([
            'ime' => 'Korisnik', 'prezime' => 'B', 'email' => 'b@test.com', 'username' => 'userb',
            'password' => bcrypt('Pass123!'), 'uloga_id' => $uloga->id, 'pol' => 'zenski', 'datumRodjenja' => '1992-02-02'
        ]);
    }

    #[Test]
    public function korisnik_ne_moze_da_obrise_tudji_obrok()
    {
       
        $obrokKorisnikaB = Obrok::create([
            'user_id' => $this->korisnikB->id,
            'datum' => '2025-01-01',
            'naziv' => 'Privatna vecera Korisnika B'
        ]);

        
        Sanctum::actingAs($this->korisnikA);

       
        $response = $this->deleteJson("/api/obroci/{$obrokKorisnikaB->id}");

        
        $response->assertStatus(403);

        
        $this->assertDatabaseHas('obroci', ['id' => $obrokKorisnikaB->id]);
    }

    #[Test]
    public function korisnik_ne_moze_da_vidi_detalje_tudjeg_obroka()
    {
        $obrokKorisnikaB = Obrok::create([
            'user_id' => $this->korisnikB->id,
            'datum' => '2025-01-01',
            'naziv' => 'Tajna uzina'
        ]);

        Sanctum::actingAs($this->korisnikA);

        $response = $this->getJson("/api/obroci/{$obrokKorisnikaB->id}");

        
        $response->assertStatus(404); 
    }

    #[Test]
    public function korisnik_ne_moze_da_izmeni_tudji_obrok()
    {
        
        $obrokZrtve = Obrok::create([
            'user_id' => $this->korisnikB->id,
            'datum' => '2025-05-05',
            'naziv' => 'Privatni Ručak'
        ]);

        
        Sanctum::actingAs($this->korisnikA);

        
        $podaciZaIzmenu = [
            'naziv' => 'Hakovano!',
            'namirnice' => [
                [
                    'custom_naziv' => 'Nesto', 
                    'kolicina' => 100, 
                    'kalorije_na_100g' => 100
                ]
            ]
        ];

       
        $response = $this->putJson("/api/obroci/{$obrokZrtve->id}", $podaciZaIzmenu);

        
        $response->assertStatus(403);

        
        $this->assertDatabaseHas('obroci', [
            'id' => $obrokZrtve->id,
            'naziv' => 'Privatni Ručak'
        ]);
    }

    #[Test]
    public function korisnik_ne_moze_da_obrise_tudji_cilj()
    {
        
        $ciljKorisnikaB = Cilj::create([
            'user_id' => $this->korisnikB->id,
            'hidriranost' => 2.5,
            'tezina' => 85,
            'kalorije' => 2500
        ]);

        
        Sanctum::actingAs($this->korisnikA);

        
        $response = $this->deleteJson("/api/cilj/{$ciljKorisnikaB->id}");

        
        $response->assertStatus(404);
        
        
        $response->assertJson(['message' => 'Cilj nije pronađen']);

       
        $this->assertDatabaseHas('cilj', [
            'id' => $ciljKorisnikaB->id,
            'user_id' => $this->korisnikB->id
        ]);
    }

    #[Test]
    public function trener_moze_da_vidi_podatke_svog_vezbaca()
    {
        $trenerUloga = Uloge::create(['ime' => 'trener']);
        $userUloga = Uloge::create(['ime' => 'korisnik']);

        $trener = User::create([
            'ime' => 'Milos', 'prezime' => 'Trener', 'email' => 'trener@test.com', 'username' => 'trener1',
            'password' => bcrypt('Pass123!'), 'uloga_id' => $trenerUloga->id, 'pol' => 'muski', 'datumRodjenja' => '1980-01-01'
        ]);

        $vezbac = User::create([
            'ime' => 'Petar', 'prezime' => 'Vezbac', 'email' => 'petar@test.com', 'username' => 'petar1',
            'password' => bcrypt('Pass123!'), 'uloga_id' => $userUloga->id, 'pol' => 'muski', 'datumRodjenja' => '2000-01-01',
            'trener_id' => $trener->id // Povezujemo ih!
        ]);

        Sanctum::actingAs($trener);

        // Ruta iz tvog koda: Route::get('/users/{user}', [UserController::class, 'show']);
        $response = $this->getJson("/api/users/{$vezbac->id}");

        $response->assertStatus(200);
        $response->assertJsonPath('id', $vezbac->id);
    }

    #[Test]
    public function korisnik_ne_moze_da_vidi_tudje_parametre()
    {
        
        $tudjiParametar = \App\Models\Parametri::create([
            'user_id' => $this->korisnikB->id,
            'date' => '2025-02-02',
            'tezina' => 95,
            'visina' => 185,
            'bmi' => 27.76,
            'masti' => 22,
            'misici' => 42,
            'obim_struka' => 98
        ]);

        Sanctum::actingAs($this->korisnikA);

        $responseList = $this->getJson('/api/parametri');

        $responseList->assertStatus(200);
        $responseList->assertJsonMissing(['tezina' => 95]);
        $responseDelete = $this->deleteJson("/api/parametar/{$tudjiParametar->id}");
        $responseDelete->assertStatus(404);

        $this->assertDatabaseHas('parametri', [
            'id' => $tudjiParametar->id,
            'user_id' => $this->korisnikB->id
        ]);
    }
}