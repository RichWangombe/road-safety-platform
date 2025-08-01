<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class TaskStatusFactory extends Factory
{
    protected $model = \App\Models\TaskStatus::class;

    public function definition()
    {
        static $position = 1;
        $name = $this->faker->unique()->randomElement(['Backlog', 'To-do', 'In-Progress', 'In Review', 'Done']);
        return [
            'name' => $name,
            'slug' => str_replace(' ', '_', strtolower($name)),
            'position' => $position++,
        ];
    }
}
