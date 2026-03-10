<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Support\Facades\Hash;

class UserPasswordTest extends TestCase
{
    /** @test */
    public function lozinka_se_uvek_kriptuje_ispravno()
    {
        $lozinka = "Tajno123!";
        $hashovanaLozinka = bcrypt($lozinka);

        $this->assertNotEquals($lozinka, $hashovanaLozinka);
        $this->assertTrue(Hash::check($lozinka, $hashovanaLozinka));
    }
}