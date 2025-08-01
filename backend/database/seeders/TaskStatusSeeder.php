<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TaskStatus;

class TaskStatusSeeder extends Seeder
{
    public function run(): void
    {
        $statuses = [
            ['name' => 'To-do', 'slug' => 'todo', 'position' => 1],
            ['name' => 'In-Progress', 'slug' => 'in_progress', 'position' => 2],
            ['name' => 'Pending-Approval', 'slug' => 'pending_approval', 'position' => 3],
            ['name' => 'Done', 'slug' => 'done', 'position' => 4],
        ];

        foreach ($statuses as $status) {
            TaskStatus::updateOrCreate(['slug' => $status['slug']], $status);
        }
    }
}
