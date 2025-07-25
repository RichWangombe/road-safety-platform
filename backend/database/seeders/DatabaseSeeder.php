<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\User::factory(10)->create();

        // Fixed users
        \App\Models\User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => 'admin',
        ]);
        \App\Models\User::factory()->create([
            'name' => 'Regular User',
            'email' => 'user@example.com',
            'role' => 'team_member',
        ]);

        $this->call([
            StakeholderSeeder::class,
        ]);
    }
}
