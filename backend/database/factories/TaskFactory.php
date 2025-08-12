<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'activity_id' => \App\Models\Activity::factory(),
            'assignee_id' => \App\Models\User::factory(),
            'title' => $this->faker->sentence(6),
            'priority' => $this->faker->randomElement(['high', 'medium', 'low']),
            'status_id' => \App\Models\TaskStatus::inRandomOrder()->first()->id ?? \App\Models\TaskStatus::factory(),
            'position' => $this->faker->numberBetween(1, 10),
            'due_date' => $this->faker->dateTimeBetween('now', '+2 months'),
        ];
    }
}
