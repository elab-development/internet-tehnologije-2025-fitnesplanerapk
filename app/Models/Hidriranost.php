<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Hidriranost extends Model
{
     protected $table = 'hidriranost';
    protected $fillable = ['user_id', 'ukupno', 'datum'];

    protected $attributes = [
        'datum' => null,
    ];

    protected static function booted()
    {
        static::creating(function ($model) {
            if (!$model->datum) {
                $model->datum = now()->toDateString();
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
