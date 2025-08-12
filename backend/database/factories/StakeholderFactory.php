<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class StakeholderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->company,
            'type' => $this->faker->randomElement(['government', 'ngo', 'private_sector', 'community']),
            'contact_person' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'phone' => $this->faker->phoneNumber,
            'engagement_level' => $this->faker->randomElement(['high', 'medium', 'low']),
            'last_interaction_date' => $this->faker->dateTimeThisYear(),
        ];
    }
}
