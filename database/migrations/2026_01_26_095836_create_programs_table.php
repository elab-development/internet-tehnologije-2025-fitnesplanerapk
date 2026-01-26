<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('programs', function (Blueprint $table) {
    $table->id();
    $table->string('naziv');
    $table->date('datum')->nullable();
    $table->integer('trajanje')->nullable();
    $table->integer('potrosene_kalorije')->nullable();
    $table->string('intenzitet')->nullable();
    $table->foreignId('korisnik_id')->constrained('users')->onDelete('cascade');
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('programs');
    }
};
