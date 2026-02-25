<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vezba extends Model
{
    use HasFactory;
    protected $table = 'vezbe';
    protected $fillable = [
        'ime',
        'snimak',
        'kategorija'
    ];

    public function programi()
    {
        return $this->belongsToMany(Program::class, 'program_vezba');
    }
    
}
