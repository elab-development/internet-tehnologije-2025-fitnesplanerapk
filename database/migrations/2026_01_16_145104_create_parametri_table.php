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
        Schema::create('parametri', function (Blueprint $table) {
           $table->id(); 
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); 
            $table->date('date'); 
            $table->double('tezina'); 
            $table->double('visina'); 
            $table->double('bmi'); 
            $table->double('masti'); 
            $table->double('misici'); 
            $table->double('obim_struka'); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parametri');
    }
};

