<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
class Parametri extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'date',
        'tezina',
        'visina',
        'bmi',
        'masti',
        'misici',
        'obim_struka',
    ];

    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
