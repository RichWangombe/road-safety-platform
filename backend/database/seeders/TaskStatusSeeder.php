<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TaskStatus;

class TaskStatusSeeder extends Seeder
{
    public function run(): void
    {
        $statuses = [
            ['name' => 'Draft', 'slug' => 'draft', 'position' => 1, 'color' => '#9E9E9E'],
            ['name' => 'Pending Team-Lead', 'slug' => 'pending_tl', 'position' => 2, 'color' => '#FFC107'],
            ['name' => 'Pending Supervisor', 'slug' => 'pending_supervisor', 'position' => 3, 'color' => '#FF9800'],
            ['name' => 'Pending Regional-Approval', 'slug' => 'pending_regional', 'position' => 4, 'color' => '#03A9F4'],
            ['name' => 'Completed', 'slug' => 'completed', 'position' => 5, 'color' => '#4CAF50'],
        ];

        foreach ($statuses as $status) {
            TaskStatus::updateOrCreate(['slug' => $status['slug']], $status);
        }
    }
}
