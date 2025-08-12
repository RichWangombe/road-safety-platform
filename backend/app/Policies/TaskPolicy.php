<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Support\Arr;

/**
 * TaskPolicy handles permission checks based on NTSA role hierarchy.
 *
 * Roles:
 *  - admin, program_manager   (global)
 *  - regional_manager         (region scoped)
 *  - supervisor, team_lead    (region scoped)
 *  - team_member              (self-assigned tasks only)
 */
class TaskPolicy
{
    use HandlesAuthorization;

    /**
     * Anyone who can create tasks can also view them; team members can view their own region tasks.
     */
    public function view(User $user, Task $task): bool
    {
        return $this->update($user, $task) || in_array($user->role, ['regional_manager','supervisor','team_lead']);
    }

    /**
     * Determine whether the user can create tasks.
     */
    public function create(User $user): bool
    {
        return in_array($user->role, ['admin','program_manager','regional_manager','supervisor','team_lead']);
    }

    /**
     * Determine whether the user can update the task.
     */
    public function update(User $user, Task $task): bool
    {
        // Global roles
        if (in_array($user->role, ['admin', 'program_manager'])) {
            return true;
        }
        // Region-scoped roles: only within their region
        if (in_array($user->role, ['regional_manager','supervisor','team_lead'])) {
            return $task->activity?->program?->region === $user->region?->name;
        }
        // Team members: only their own tasks
        return $task->assignee_id === $user->id;
    }

    /**
     * Determine whether the user can delete the task.
     */
    public function delete(User $user, Task $task): bool
    {
        if ($user->role === 'team_member') {
            return false;
        }
        return true;
    }

    /**
     * Determine whether the user can move the task (change status/position).
     */
    public function updateStatus(User $user, Task $task): bool
    {
        // Reuse same logic as move (changing column means changing status)
        return $this->move($user, $task);
    }

    public function move(User $user, Task $task): bool
    {
        return $this->update($user, $task);
    }
}
