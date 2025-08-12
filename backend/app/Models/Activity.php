<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;
use App\Models\User;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'program_id',
        'name',
        'description',
        'status',
        'start_date',
        'end_date',
    ];

    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    /**
     * Scope a query to only include activities the given user may view.
     */
    public function scopeAllowed(Builder $query, User $user): Builder
    {
        if (in_array($user->role, ['admin','program_manager'])) {
            return $query;
        }
        if (in_array($user->role, ['regional_manager','supervisor','team_lead'])) {
            return $query->whereHas('program', function ($q) use ($user) {
                $q->where('region', $user->region?->name);
            });
        }
        return $query->whereHas('tasks', function ($q) use ($user) {
            $q->where('assignee_id', $user->id);
        });
    }
}
