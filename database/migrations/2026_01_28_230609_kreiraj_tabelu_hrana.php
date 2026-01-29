<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hrana', function (Blueprint $table) {
            $table->id();
            $table->string('naziv'); // naziv hrane
            $table->integer('kalorije'); // kalorije po jedinici
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hrana');
    }
};
