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
        Schema::create('programi', function (Blueprint $table) {
            $table->id();
            $table->string('naziv');
            $table->unsignedBigInteger('korisnik_id');
            $table->integer('trajanje')->nullable();
            $table->float('kalorije')->nullable();
            $table->string('intenzitet')->nullable();
            $table->boolean('public')->default(false); // ovo polje za public/private
            $table->timestamps();

            $table->foreign('korisnik_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('programi');
    }
};
