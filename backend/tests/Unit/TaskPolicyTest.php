<?php

namespace Tests\Unit;

use App\Models\{Task, TaskStatus, Activity, Program, User, Region};
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskPolicyTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // basic fixtures
        $this->regionNbi = Region::factory()->create(['name' => 'Nairobi']);
        $this->regionCoast = Region::factory()->create(['name' => 'Coast']);

        $this->pm = User::factory()->create(['role' => 'program_manager']);
        $this->rmNbi = User::factory()->create([
            'role' => 'regional_manager',
            'region_id' => $this->regionNbi->id,
        ]);
        $this->teamMember = User::factory()->create([
            'role' => 'team_member',
            'region_id' => $this->regionNbi->id,
        ]);

        $program = Program::factory()->create([
            'region' => 'Nairobi',
            'manager_id' => $this->pm->id,
        ]);
        $activity = Activity::factory()->create(['program_id' => $program->id]);
        $status = TaskStatus::factory()->create();

        $this->task = Task::factory()->create([
            'activity_id' => $activity->id,
            'status_id'   => $status->id,
            'assignee_id' => $this->teamMember->id,
        ]);
    }

    /** @test */
    public function program_manager_can_move_any_task()
    {
        $this->assertTrue($this->pm->can('move', $this->task));
    }

    /** @test */
    public function regional_manager_can_move_task_in_own_region()
    {
        $this->assertTrue($this->rmNbi->can('move', $this->task));
    }

    /** @test */
    public function team_member_cannot_move_others_tasks()
    {
        $otherTask = Task::factory()->create();
        $this->assertFalse($this->teamMember->can('move', $otherTask));
    }

    /** @test */
    public function team_member_can_move_own_task()
    {
        $this->assertTrue($this->teamMember->can('move', $this->task));
    }
}
