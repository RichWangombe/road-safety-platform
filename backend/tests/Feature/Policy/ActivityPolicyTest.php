<?php

declare(strict_types=1);

namespace Tests\Feature\Policy;

use App\Models\User;
use App\Models\Region;
use App\Models\Program;
use App\Models\Activity;
use App\Models\Task;
use App\Policies\ActivityPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ActivityPolicyTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @test
     * Global roles can view any activity
     */
    public function global_roles_can_view_any_activity()
    {
        $policy = new ActivityPolicy();
        $roles  = ['admin', 'program_manager'];

        foreach ($roles as $role) {
            $user     = User::factory()->create(['role' => $role]);
            $activity = Activity::factory()->create();

            $this->assertTrue(
                $policy->view($user, $activity),
                "Role {$role} should view any activity"
            );
        }
    }

    /**
     * @test
     * Region roles can view activities in their region only
     */
    public function region_roles_view_limited_to_their_region()
    {
        $policy = new ActivityPolicy();

        // Create two regions
        $regionEast = Region::create(['name' => 'East']);
        $regionWest = Region::create(['name' => 'West']);

        // Programs in each region
        $programEast = Program::factory()->create(['region' => 'East']);
        $programWest = Program::factory()->create(['region' => 'West']);

        // Activities under each program
        $activityEast = Activity::factory()->create(['program_id' => $programEast->id]);
        $activityWest = Activity::factory()->create(['program_id' => $programWest->id]);

        // User scoped to East region
        $userEast = User::factory()->create([
            'role'      => 'regional_manager',
            'region_id' => $regionEast->id,
        ]);

        $this->assertTrue(
            $policy->view($userEast, $activityEast),
            "Regional role should view activities in their region"
        );
        $this->assertFalse(
            $policy->view($userEast, $activityWest),
            "Regional role should not view activities outside their region"
        );
    }

    /**
     * @test
     * Team members can view activities of tasks assigned to them only
     */
    public function team_members_view_only_assigned_activities()
    {
        $policy = new ActivityPolicy();

        $user         = User::factory()->create(['role' => 'team_member']);
        $activity     = Activity::factory()->create();
        $other        = Activity::factory()->create();

        // Task assigned to this user under activity
        Task::factory()->create([
            'assignee_id' => $user->id,
            'activity_id' => $activity->id,
        ]);

        // Task not assigned to this user
        Task::factory()->create([
            'assignee_id' => 999,
            'activity_id' => $other->id,
        ]);

        $this->assertTrue(
            $policy->view($user, $activity),
            "Team member should view their assigned activity"
        );
        $this->assertFalse(
            $policy->view($user, $other),
            "Team member should not view activities with no assigned tasks"
        );
    }
}
