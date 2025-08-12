<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ProgramFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'status' => $this->faker->randomElement(['planning', 'active', 'completed', 'on_hold']),
            'priority' => $this->faker->randomElement(['high', 'medium', 'low']),
            'start_date' => $this->faker->dateTimeBetween('-6 months', 'now'),
            'end_date' => $this->faker->dateTimeBetween('now', '+6 months'),
            'budget' => $this->faker->randomFloat(2, 100000, 10000000),
            'manager_id' => \App\Models\User::factory(),
            'region' => $this->faker->randomElement(['Nairobi', 'Coast', 'Central', 'Rift Valley', 'Western', 'Eastern', 'Nyanza', 'North Eastern']),
        ];
    }
}
