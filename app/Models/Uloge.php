<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Uloge extends Model
{
    
    use HasFactory;
    protected $table = 'uloge';
    protected $fillable = [
        'ime'
    
        
    ];

    public function users()
    {
        return $this->hasMany(User::class); 
    }
}
