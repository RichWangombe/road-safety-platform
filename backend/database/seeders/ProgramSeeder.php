<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\Program::factory(5)->create()->each(function ($program) {
            \App\Models\Activity::factory(3)->create([ 'program_id' => $program->id ])
                ->each(function ($activity) {
                    \App\Models\Task::factory(5)->create([
                        'activity_id' => $activity->id,
                    ]);
                });
        });
    }
}
