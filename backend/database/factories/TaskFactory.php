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
            'status' => $this->faker->randomElement(['todo', 'in_progress', 'done']),
            'due_date' => $this->faker->dateTimeBetween('now', '+2 months'),
        ];
    }
}
