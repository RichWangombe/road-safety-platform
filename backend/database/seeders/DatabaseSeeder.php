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
        \App\Models\User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'role' => 'admin',
                'password' => bcrypt('password'),
            ]
        );
        \App\Models\User::updateOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'Regular User',
                'role' => 'team_member',
                'password' => bcrypt('password'),
            ]
        );

        $this->call([
            RegionSeeder::class,
            DemoUserSeeder::class,
            TaskStatusSeeder::class,
            StakeholderSeeder::class,
            ProgramSeeder::class,
            ActivitySeeder::class,
            TaskSeeder::class,
        ]);
    }
}
