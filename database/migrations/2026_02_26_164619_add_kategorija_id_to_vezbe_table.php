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
    Schema::table('vezbe', function (Blueprint $table) {
        $table->string('ime_sr')->nullable();
        $table->foreignId('kategorija_id')
              ->constrained('kategorije')
              ->onDelete('cascade');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vezbe', function (Blueprint $table) {
            //
        });
    }
};
