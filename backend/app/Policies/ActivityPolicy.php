<?php

namespace App\Policies;

use App\Models\Activity;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ActivityPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the activity.
     */
    public function view(User $user, Activity $activity): bool
    {
        // global roles can view all
        if (in_array($user->role, ['admin', 'program_manager'])) {
            return true;
        }

        // region-scoped roles can see activities whose program.region matches their region
        if (in_array($user->role, ['regional_manager', 'supervisor', 'team_lead'])) {
            return $activity->program?->region === $user->region?->name;
        }

        // team members can see activities of tasks assigned to them
        return $activity->tasks()->where('assignee_id', $user->id)->exists();
    }
}
