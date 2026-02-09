<?php




namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'ime',
        'prezime',
        'email',
        'username',
        'password',
        'pol',
        'datumRodjenja',
        'uloga_id' 
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    
    public function ciljevi()
    {
        return $this->hasMany(Cilj::class);
    }

    public function parametri()
    {
        return $this->hasMany(Parametri::class);
    }

    public function uloga()
    {
        return $this->belongsTo(Uloge::class, 'uloga_id'); 
    }

    public function hidriranost()
    {
        return $this->belongsTo(Hidriranost::class, 'hidriranost_id'); 
    }
}
