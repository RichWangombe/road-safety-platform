<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\Program::factory(5)->create()->each(function ($program) {
            \App\Models\Activity::factory(3)->create([ 'program_id' => $program->id ])
                ->each(function ($activity) {
                    \App\Models\Task::factory(5)->create([
                        'activity_id' => $activity->id,
                    ]);
                });
        });

        // Ensure a Nairobi-scoped demo with visible tasks for the supervisor account
        $pm = \App\Models\User::where('email', 'pm@example.com')->first();
        $tlNbi = \App\Models\User::where('email', 'tl.nbi@example.com')->first();
        $tmNbi = \App\Models\User::where('email', 'tm.nbi@example.com')->first();
        $assignee = $tmNbi ?: $tlNbi ?: \App\Models\User::first();

        $program = \App\Models\Program::updateOrCreate(
            ['name' => 'Nairobi Road Safety Demo'],
            [
                'description' => 'Seeded demo program for Nairobi region to showcase Task Board.',
                'status' => 'active',
                'priority' => 'high',
                'start_date' => now()->subMonth(),
                'end_date' => now()->addMonths(3),
                'budget' => 1000000,
                'manager_id' => $pm?->id,
                'region' => 'Nairobi',
            ]
        );

        // Create two activities under this program
        $activity1 = \App\Models\Activity::updateOrCreate(
            ['program_id' => $program->id, 'name' => 'Helmet Awareness Campaign'],
            [
                'description' => 'Community outreach and awareness.',
                'status' => 'in_progress',
                'start_date' => now()->subWeeks(2),
                'end_date' => now()->addWeeks(4),
            ]
        );
        $activity2 = \App\Models\Activity::updateOrCreate(
            ['program_id' => $program->id, 'name' => 'Speed Enforcement Drive'],
            [
                'description' => 'Targeted enforcement in high-risk zones.',
                'status' => 'in_progress',
                'start_date' => now()->subWeek(),
                'end_date' => now()->addWeeks(6),
            ]
        );

        // Fetch useful statuses
        $statusDraft = \App\Models\TaskStatus::where('slug', 'draft')->value('id');
        $statusPendingTL = \App\Models\TaskStatus::where('slug', 'pending_tl')->value('id');
        $statusPendingSup = \App\Models\TaskStatus::where('slug', 'pending_supervisor')->value('id');
        $statusPendingReg = \App\Models\TaskStatus::where('slug', 'pending_regional')->value('id');
        $statusCompleted = \App\Models\TaskStatus::where('slug', 'completed')->value('id');

        // Create several tasks with different dates and statuses
        \App\Models\Task::updateOrCreate(
            ['activity_id' => $activity1->id, 'title' => 'Distribute flyers at CBD'],
            [
                'assignee_id' => $assignee?->id,
                'priority' => 'high',
                'status_id' => $statusPendingSup ?: $statusPendingTL,
                'position' => 1,
                'due_date' => now()->subDays(2), // overdue
            ]
        );

        \App\Models\Task::updateOrCreate(
            ['activity_id' => $activity1->id, 'title' => 'School talks session A'],
            [
                'assignee_id' => $assignee?->id,
                'priority' => 'medium',
                'status_id' => $statusDraft ?: $statusPendingTL,
                'position' => 2,
                'due_date' => now(), // due today
            ]
        );

        \App\Models\Task::updateOrCreate(
            ['activity_id' => $activity2->id, 'title' => 'Radar setup training'],
            [
                'assignee_id' => $assignee?->id,
                'priority' => 'low',
                'status_id' => $statusPendingTL ?: $statusDraft,
                'position' => 1,
                'due_date' => now()->addDays(5),
            ]
        );

        \App\Models\Task::updateOrCreate(
            ['activity_id' => $activity2->id, 'title' => 'Compile weekly enforcement report'],
            [
                'assignee_id' => $assignee?->id,
                'priority' => 'high',
                'status_id' => $statusCompleted ?: $statusPendingReg,
                'position' => 2,
                'due_date' => now()->subDay(),
            ]
        );

        // Extra Nairobi programs and activities for richer demos
        $extraPrograms = [
            [
                'name' => 'Nairobi School Zone Safety',
                'description' => 'Improve safety around school zones across Nairobi.',
                'priority' => 'medium',
                'activities' => [
                    ['name' => 'Zebra Crossing Refresh', 'description' => 'Repaint crossings and update signage near schools.'],
                    ['name' => 'School Marshals Training', 'description' => 'Training sessions for crossing marshals.'],
                ],
            ],
            [
                'name' => 'Nairobi Public Transport Safety',
                'description' => 'PSV safety improvements and compliance initiatives.',
                'priority' => 'high',
                'activities' => [
                    ['name' => 'PSV Driver Workshops', 'description' => 'Road safety workshops for PSV drivers.'],
                    ['name' => 'Matatu Safety Inspections', 'description' => 'Periodic inspections for safety compliance.'],
                ],
            ],
            [
                'name' => 'Nairobi Infrastructure Upgrades',
                'description' => 'Upgrades to traffic infrastructure across hotspots.',
                'priority' => 'medium',
                'activities' => [
                    ['name' => 'Traffic Light Maintenance', 'description' => 'Repair and maintain non-functional traffic lights.'],
                    ['name' => 'Speed Bump Installation', 'description' => 'Install speed bumps in high-risk zones.'],
                ],
            ],
        ];

        foreach ($extraPrograms as $p) {
            $prog = \App\Models\Program::updateOrCreate(
                ['name' => $p['name']],
                [
                    'description' => $p['description'],
                    'status' => 'active',
                    'priority' => $p['priority'],
                    'start_date' => now()->subWeeks(2),
                    'end_date' => now()->addMonths(2),
                    'budget' => 500000,
                    'manager_id' => $pm?->id,
                    'region' => 'Nairobi',
                ]
            );

            foreach ($p['activities'] as $a) {
                $act = \App\Models\Activity::updateOrCreate(
                    ['program_id' => $prog->id, 'name' => $a['name']],
                    [
                        'description' => $a['description'],
                        'status' => 'in_progress',
                        'start_date' => now()->subDays(rand(1,14)),
                        'end_date' => now()->addWeeks(rand(2,8)),
                    ]
                );

                // Tasks across statuses for better column coverage on Task Board
                \App\Models\Task::updateOrCreate(
                    ['activity_id' => $act->id, 'title' => $a['name'].' - Kickoff'],
                    [
                        'assignee_id' => $assignee?->id,
                        'priority' => 'medium',
                        'status_id' => $statusDraft ?: $statusPendingTL,
                        'position' => 1,
                        'due_date' => now()->addDays(2),
                    ]
                );

                \App\Models\Task::updateOrCreate(
                    ['activity_id' => $act->id, 'title' => $a['name'].' - Field Work'],
                    [
                        'assignee_id' => $assignee?->id,
                        'priority' => 'high',
                        'status_id' => $statusPendingTL ?: $statusPendingSup,
                        'position' => 2,
                        'due_date' => now()->addDays(5),
                    ]
                );

                \App\Models\Task::updateOrCreate(
                    ['activity_id' => $act->id, 'title' => $a['name'].' - Report Compilation'],
                    [
                        'assignee_id' => $assignee?->id,
                        'priority' => 'low',
                        'status_id' => $statusPendingSup ?: $statusPendingReg,
                        'position' => 3,
                        'due_date' => now()->addDays(7),
                    ]
                );
            }
        }
    }
}
