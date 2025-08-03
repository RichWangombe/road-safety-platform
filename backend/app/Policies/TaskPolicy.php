<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TaskPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can create tasks.
     */
    public function create(User $user): bool
    {
        // Team Members cannot create; others can.
        return $user->role !== 'team_member';
    }

    /**
     * Determine whether the user can update the task.
     */
    public function update(User $user, Task $task): bool
    {
        if ($user->role === 'team_member') {
            return $task->assignee_id === $user->id;
        }
        return true; // higher roles allowed for now
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
    public function move(User $user, Task $task): bool
    {
        return $this->update($user, $task);
    }
}
