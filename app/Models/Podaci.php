<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Podaci extends Model
{
    protected $fillable = [
    'trajanje',
    'broj',
    'serija',
    'ponavljanja',
    'tezina',
    'bpm',
    'vezba_id'
];

}
