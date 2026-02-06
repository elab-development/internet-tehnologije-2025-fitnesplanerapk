<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Podaci extends Model
{
    protected $fillable = [
        'trajanje',
        'serija',
        'ponavljanja',
        'tezina',
        'bpm',
        'vezba_id',
        'program_id'
    ];

    public function vezba()
    {
        return $this->belongsTo(Vezba::class);
    }

    public function program()
    {
        return $this->belongsTo(Program::class);
    }
}

