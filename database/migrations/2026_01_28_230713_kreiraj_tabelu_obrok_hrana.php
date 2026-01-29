<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('obrok_hrana', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('obrok_id'); // strani ključ na obroci
            $table->unsignedBigInteger('hrana_id')->nullable(); // strani ključ na hrana
            $table->string('prilagodjena_hrana')->nullable(); // custom naziv ako korisnik doda novu hranu
            $table->integer('kolicina'); // koliko grama/komada
            $table->integer('kalorije'); // ukupne kalorije za tu količinu
            $table->timestamps();

            // strani ključevi
            $table->foreign('obrok_id')->references('id')->on('obroci')->onDelete('cascade');
            $table->foreign('hrana_id')->references('id')->on('hrana')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('obrok_hrana');
    }
};
