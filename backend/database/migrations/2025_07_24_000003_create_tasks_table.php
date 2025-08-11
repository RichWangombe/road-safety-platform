<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            if (Schema::getConnection()->getDriverName() !== 'sqlite') {
                $table->foreignId('activity_id')->constrained('activities')->onDelete('cascade');
                $table->foreignId('assignee_id')->constrained('users');
            } else {
                $table->unsignedBigInteger('activity_id');
                $table->unsignedBigInteger('assignee_id');
            }
            $table->string('title');
            $table->string('priority'); // e.g., 'high', 'medium', 'low'
            $table->unsignedBigInteger('status_id')->after('priority');
            $table->unsignedInteger('position')->default(0)->after('status_id');
            $table->date('due_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tasks');
    }
};
