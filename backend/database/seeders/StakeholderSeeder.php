<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Stakeholder;

class StakeholderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Stakeholder::factory()->count(10)->create();
    }
}
