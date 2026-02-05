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
        Schema::create('podaci', function (Blueprint $table) {
        $table->id();
        $table->integer('trajanje')->nullable();
        $table->integer('broj')->nullable();
        $table->integer('serija')->nullable();
        $table->integer('ponavljanja')->nullable();
        $table->integer('tezina')->nullable();
        $table->integer('bpm')->nullable();
        $table->foreignId('vezba_id')->constrained('vezbe')->onDelete('cascade');
        $table->timestamps();
    });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('podacis');
    }
};
