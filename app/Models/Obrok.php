<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Obrok extends Model
{
    use HasFactory;

    protected $table = 'obroci';

    protected $fillable = [
        'user_id',
        'datum',
        'naziv',
    ];

    
    public function hrana()
    {
        return $this->hasMany(ObrokHrana::class, 'obrok_id', 'id');
    }
}
