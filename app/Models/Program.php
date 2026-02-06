<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    use HasFactory;

    protected $table = 'programi'; 

    protected $fillable = [
        'naziv',
        'datum',
        'trajanje',
        'potrosene_kalorije',
        'intenzitet',
        'korisnik_id'
    ];

    public function vezbe()
    {
        
        return $this->belongsToMany(Vezba::class, 'program_vezba')
                    ->withPivot('dan', 'serija', 'ponavljanja', 'tezina', 'trajanje', 'bpm')    
                    ->withTimestamps();
    }

   public function podaci()
{
    return $this->hasMany(Podaci::class);
}



}