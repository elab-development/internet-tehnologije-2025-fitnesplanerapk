<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('obroci', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable(); // za korisnika
            $table->date('datum'); // datum obroka
            $table->string('naziv'); // npr. Doručak, Ručak...
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('obroci');
    }
};
