<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ObrokHrana extends Model
{
    use HasFactory;

    protected $table = 'obrok_hrana';

    protected $fillable = [
        'obrok_id',
        'hrana_id',
        'prilagodjena_hrana',
        'kolicina',
        'kalorije',
    ];

    // Veza ka Obroku
    public function obrok()
    {
        return $this->belongsTo(Obrok::class, 'obrok_id', 'id');
    }

    // Veza ka Hrani (može biti null za custom hranu)
    public function hrana()
    {
        return $this->belongsTo(Hrana::class, 'hrana_id', 'id');
    }
}
