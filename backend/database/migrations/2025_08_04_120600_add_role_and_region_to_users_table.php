<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'role')) {
                $table->string('role')->default('team_member')->after('email');
            }
            if (!Schema::hasColumn('users', 'region_id')) {
                $table->foreignId('region_id')->nullable()->constrained('regions')->after('role');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['region_id']);
            $table->dropColumn(['region_id', 'role']);
        });
    }
};
