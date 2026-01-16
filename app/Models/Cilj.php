<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Cilj extends Model
{
    use HasFactory;
    protected $fillable = [
        'hidriranost',
        'tezina',
        'dnevne_kalorije',
        
    ];

   
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
