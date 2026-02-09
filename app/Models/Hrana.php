<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hrana extends Model
{
    use HasFactory;

    protected $table = 'hrana';

    protected $fillable = [
        'naziv',
        'kalorije',
    ];

   
    public function obrokHrana()
    {
        return $this->hasMany(ObrokHrana::class, 'hrana_id', 'id');
    }
}
