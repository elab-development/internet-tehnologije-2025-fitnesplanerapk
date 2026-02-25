<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('program_vezba', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('program_id');
            $table->unsignedBigInteger('vezba_id');
            $table->integer('dan')->default(1);
            $table->integer('serija')->nullable();
            $table->integer('ponavljanja')->nullable();
            $table->float('tezina')->nullable();
            $table->integer('trajanje')->nullable();
            $table->integer('bpm')->nullable();
            $table->timestamps();

            $table->foreign('program_id')->references('id')->on('programi')->onDelete('cascade');
            $table->foreign('vezba_id')->references('id')->on('vezbe')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('program_vezba');
    }
};