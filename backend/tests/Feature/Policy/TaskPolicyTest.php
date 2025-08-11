<?php

declare(strict_types=1);

namespace Tests\Feature\Policy;

use App\Models\User;
use App\Models\Task;
use App\Policies\TaskPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskPolicyTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @test
     * Ensure roles have correct create permission
     */
    public function roles_create_permission()
    {
        $rolesAllowed = ['admin', 'program_manager', 'regional_manager', 'supervisor', 'team_lead'];
        $allRoles    = array_merge($rolesAllowed, ['team_member']);

        foreach ($allRoles as $role) {
            $user   = User::factory()->make(['role' => $role]);
            $policy = new TaskPolicy();

            $expected = in_array($role, $rolesAllowed, true);
            $this->assertEquals(
                $expected,
                $policy->create($user),
                "Role {$role} create permission mismatch"
            );
        }
    }

    /**
     * @test
     * Ensure roles have correct update and move permissions
     */
    public function roles_update_and_move_permission()
    {
        $rolesAllowed = ['admin', 'program_manager', 'regional_manager', 'supervisor', 'team_lead'];
        $task         = Task::factory()->make(['assignee_id' => 999]);
        $allRoles     = array_merge($rolesAllowed, ['team_member']);

        foreach ($allRoles as $role) {
            $user   = User::factory()->make(['role' => $role, 'id' => 1]);
            $policy = new TaskPolicy();

            $canUpdate = $policy->update($user, $task);
            $canMove   = $policy->move($user, $task);

            if ($role === 'team_member') {
                $this->assertFalse($canUpdate, "Role {$role} should not update others' tasks");
                $this->assertFalse($canMove,   "Role {$role} should not move others' tasks");
            } else {
                $this->assertTrue($canUpdate, "Role {$role} should update other tasks");
                $this->assertTrue($canMove,   "Role {$role} should move other tasks");
            }
        }
    }
}
