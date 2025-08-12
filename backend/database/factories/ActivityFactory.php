<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ActivityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'program_id' => \App\Models\Program::factory(),
            'name' => $this->faker->sentence(4),
            'description' => $this->faker->paragraph(),
            'status' => $this->faker->randomElement(['not_started', 'in_progress', 'completed']),
            'start_date' => $this->faker->dateTimeBetween('-3 months', 'now'),
            'end_date' => $this->faker->dateTimeBetween('now', '+3 months'),
        ];
    }
}
