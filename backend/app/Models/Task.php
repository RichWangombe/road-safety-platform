<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use App\Models\User;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'activity_id',
        'assignee_id',
        'title',
        'priority',
        'status_id',
        'position',
        'due_date',
    ];

    public function activity(): BelongsTo
    {
        return $this->belongsTo(Activity::class);
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(TaskStatus::class, 'status_id');
    }

    /**
     * Scope a query to only include tasks the given user is allowed to see.
     */
    public function scopeAllowed(Builder $query, ?User $user = null): Builder
    {
        // If no user provided (should be protected by auth middleware), return query unmodified to avoid errors.
        if (!$user) {
            return $query;
        }

        // Global roles
        if (in_array($user->role, ['admin', 'program_manager'])) {
            return $query;
        }

        // Region-scoped roles (regional_manager, supervisor, team_lead)
        if (in_array($user->role, ['regional_manager', 'supervisor', 'team_lead'])) {
            return $query->whereHas('activity.program', function ($q) use ($user) {
                $q->where('region', $user->region?->name);
            });
        }

        // Team members only see tasks assigned to them
        return $query->where('assignee_id', $user->id);
    }
}
