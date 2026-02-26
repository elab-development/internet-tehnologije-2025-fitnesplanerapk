<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('vezbe', function (Blueprint $table) {
        $table->id();
        $table->string('naziv_en');           // naziv na engleskom
        $table->string('naziv_sr')->nullable(); // naziv na srpskom
        $table->text('opis')->nullable();
        $table->string('misic')->nullable();
        $table->string('slika')->nullable();
        $table->string('video')->nullable();  // YouTube link
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vezbe');
    }
};
