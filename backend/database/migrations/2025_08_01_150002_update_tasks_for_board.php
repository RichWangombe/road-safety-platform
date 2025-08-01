<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            // rename old status column if it still exists
            if (Schema::hasColumn('tasks', 'status')) {
                $table->dropColumn('status');
            }
            $table->unsignedBigInteger('status_id')->after('priority');
            $table->unsignedInteger('position')->default(0)->after('status_id');

            $table->foreign('status_id')->references('id')->on('task_statuses')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeign(['status_id']);
            $table->dropColumn(['status_id', 'position']);
            $table->string('status')->after('priority');
        });
    }
};
