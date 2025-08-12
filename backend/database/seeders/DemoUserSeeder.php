<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Region;
use Illuminate\Support\Facades\Hash;

class DemoUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ensure regions exist
        $nairobi = Region::firstOrCreate(['name' => 'Nairobi']);
        $coast   = Region::firstOrCreate(['name' => 'Coast']);

        $users = [
            ['Program Manager', 'pm@example.com', 'program_manager', null],
            ['Regional Manager Nairobi', 'rm.nbi@example.com', 'regional_manager', $nairobi->id],
            ['Supervisor Nairobi', 'sup.nbi@example.com', 'supervisor', $nairobi->id],
            ['Team Lead Nairobi', 'tl.nbi@example.com', 'team_lead', $nairobi->id],
            ['Team Member Nairobi', 'tm.nbi@example.com', 'team_member', $nairobi->id],
            ['Regional Manager Coast', 'rm.coast@example.com', 'regional_manager', $coast->id],
        ];

        foreach ($users as [$name, $email, $role, $regionId]) {
            User::updateOrCreate(
                ['email' => $email],
                [
                    'name' => $name,
                    'password' => Hash::make('password'),
                    'role' => $role,
                    'region_id' => $regionId,
                ]
            );
        }
    }
}
