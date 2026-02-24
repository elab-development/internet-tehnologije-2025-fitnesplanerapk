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
        Schema::table('users', function (Blueprint $table) {
            // Kolona koja označava trenera korisnika
            $table->unsignedBigInteger('trener_id')->nullable()->after('uloga_id');

            // Postavljamo foreign key na istu tabelu
            $table->foreign('trener_id')
                ->references('id')
                ->on('users')
                ->onDelete('set null'); // Ako trener bude obrisan, vezbaču se trener_id postavlja na null
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['trener_id']);
            $table->dropColumn('trener_id');
        });
    }
};