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
        Schema::create('programs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('status'); // e.g., 'planning', 'active', 'completed', 'on_hold'
            $table->string('priority'); // e.g., 'high', 'medium', 'low'
            $table->date('start_date');
            $table->date('end_date');
            $table->decimal('budget', 15, 2)->nullable();
            $table->foreignId('manager_id')->constrained('users');
            $table->string('region');
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
        Schema::dropIfExists('programs');
    }
};
