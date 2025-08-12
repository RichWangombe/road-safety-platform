<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;
use App\Models\User;

class Program extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'status',
        'priority',
        'start_date',
        'end_date',
        'budget',
        'manager_id',
        'region',
    ];

    /**
     * Manager (user) who owns the program.
     */
    public function manager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    /**
     * Activities that belong to the program.
     */
    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class);
    }

    /**
     * Scope programs a user is allowed to view.
     */
    public function scopeAllowed(Builder $query, User $user): Builder
    {
        if (in_array($user->role, ['admin','program_manager'])) {
            return $query;
        }
        if (in_array($user->role, ['regional_manager','supervisor','team_lead'])) {
            return $query->where('region', $user->region?->name);
        }
        // team members see programs that have activities with tasks assigned to them
        return $query->whereHas('activities.tasks', function ($q) use ($user) {
            $q->where('assignee_id', $user->id);
        });
    }
}
