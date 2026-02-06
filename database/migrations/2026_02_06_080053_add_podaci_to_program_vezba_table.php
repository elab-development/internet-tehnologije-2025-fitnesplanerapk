<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('program_vezba', function (Blueprint $table) {
            $table->integer('serija')->nullable();
            $table->integer('ponavljanja')->nullable();
            $table->integer('tezina')->nullable();
            $table->integer('trajanje')->nullable();
            $table->integer('bpm')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('program_vezba', function (Blueprint $table) {
            $table->dropColumn([
                'serija',
                'ponavljanja',
                'tezina',
                'trajanje',
                'bpm'
            ]);
        });
    }
};
