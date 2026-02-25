<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
    'ime',
    'prezime',
    'email',
    'username',
    'password',
    'pol',
    'datumRodjenja',
    'uloga_id',
    'trener_id',
    'profile_image',
    'biografija'
];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relacije
    public function ciljevi()
    {
        return $this->hasMany(Cilj::class);
    }

    public function parametri()
    {
        return $this->hasMany(Parametri::class);
    }

    public function uloga()
    {
        return $this->belongsTo(Uloge::class, 'uloga_id'); 
    }

    public function hidriranost()
    {
        return $this->belongsTo(Hidriranost::class, 'hidriranost_id'); 
    }

    // 🔹 RELACIJA SELF-REFERENCE: Vezbač -> Trener
    public function trener()
    {
        return $this->belongsTo(User::class, 'trener_id');
    }

    // 🔹 RELACIJA SELF-REFERENCE: Trener -> Vezbači
    public function vezbaci()
    {
        return $this->hasMany(User::class, 'trener_id');
    }

    // Helper funkcije za lakšu identifikaciju uloge
    public function isTrener()
    {
        return $this->uloga->ime === 'trener';
    }

    public function isVezbac()
    {
        return $this->uloga->ime === 'korisnik';
    }
}