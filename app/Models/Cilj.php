<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Cilj extends Model
{
    use HasFactory;
    protected $table = 'cilj';
    protected $fillable = [
        'user_id',
        'hidriranost',
        'tezina',
        'kalorije',
        
    ];

   
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
