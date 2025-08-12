<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Seed tasks for existing activities
        $activities = \App\Models\Activity::all();
        foreach ($activities as $activity) {
            \App\Models\Task::factory()
                ->count(5)
                ->create(['activity_id' => $activity->id]);
        }
    }
}
