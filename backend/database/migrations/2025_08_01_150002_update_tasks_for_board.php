<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            // Drop old status column if it exists
            if (Schema::hasColumn('tasks', 'status')) {
                $table->dropColumn('status');
            }
            // Add status_id and position if they don't already exist
            if (! Schema::hasColumn('tasks', 'status_id')) {
                $table->unsignedBigInteger('status_id')->after('priority');
            }
            if (! Schema::hasColumn('tasks', 'position')) {
                $table->unsignedInteger('position')->default(0)->after('status_id');
            }
            // Add foreign key constraint on non-SQLite
            if (Schema::getConnection()->getDriverName() !== 'sqlite') {
                $table->foreign('status_id')->references('id')->on('task_statuses')->onDelete('restrict');
            }
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
