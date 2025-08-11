<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Task;
use App\Models\TaskStatus;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class TaskController extends Controller
{
    /**
     * List tasks, optionally filtered by activity or status.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Task::with(['activity.program', 'assignee', 'status'])->allowed($user);

        if ($request->filled('activity_id')) {
            $query->where('activity_id', (int) $request->input('activity_id'));
        }

        if ($request->filled('status_id')) {
            $query->where('status_id', (int) $request->input('status_id'));
        }

        if ($request->filled('program_id')) {
            $programId = (int) $request->input('program_id');
            $query->whereHas('activity.program', function ($q) use ($programId) {
                $q->where('id', $programId);
            });
        }

        if ($request->filled('region')) {
            $region = $request->input('region');
            $query->whereHas('activity.program', function ($q) use ($region) {
                $q->where('region', $region);
            });
        }

        if ($request->filled('assignee_id')) {
            $query->where('assignee_id', (int) $request->input('assignee_id'));
        }

        if ($request->filled('priority')) {
            $query->where('priority', $request->input('priority'));
        }

        if ($request->filled('date_from')) {
            $query->whereDate('due_date', '>=', $request->input('date_from'));
        }
        if ($request->filled('date_to')) {
            $query->whereDate('due_date', '<=', $request->input('date_to'));
        }

        if ($request->boolean('needs_approval')) {
            $pendingSlugs = ['pending_tl', 'pending_supervisor', 'pending_regional'];
            $query->whereHas('status', function ($q) use ($pendingSlugs) {
                $q->whereIn('slug', $pendingSlugs);
            });
        }

        return $query->orderBy('position')->get();
    }

    /**
     * Store a newly created task.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'activity_id' => 'required|exists:activities,id',
            'assignee_id' => 'required|exists:users,id',
            'title'       => 'required|string|max:255',
            'priority'    => 'required|in:high,medium,low',
            'status_id'   => 'required|exists:task_statuses,id',
            'due_date'    => 'nullable|date',
        ]);

        // set position to end of column
        $maxPosition = Task::where('status_id', $data['status_id'])->max('position');
        $data['position'] = ($maxPosition ?? 0) + 1;

        $task = Task::create($data);

        return response()->json($task->load('status'), 201);
    }

    /**
     * Display a single task.
     */
    public function show(Task $task)
    {
        return $task->load(['activity', 'assignee', 'status']);
    }

    /**
     * Update a task.
     */
    public function update(Request $request, Task $task)
    {
        $data = $request->validate([
            'title'     => 'sometimes|string|max:255',
            'priority'  => 'sometimes|in:high,medium,low',
            'due_date'  => 'sometimes|date',
        ]);

        $task->update($data);

        return $task->refresh();
    }

    /**
     * Delete a task.
     */
    public function destroy(Task $task)
    {
        $task->delete();
        return response()->noContent();
    }

    /**
     * Move a task to a different column / position.
     */
    public function move(Request $request, Task $task)
    {
        $data = $request->validate([
            'status_id' => 'required|exists:task_statuses,id',
            'position'  => 'required|integer|min:0',
        ]);

        $this->authorize('move', $task);

        DB::transaction(function () use ($task, $data) {
            // Decrement positions in old column
            Task::where('status_id', $task->status_id)
                ->where('position', '>', $task->position)
                ->decrement('position');

            // Increment positions in new column
            Task::where('status_id', $data['status_id'])
                ->where('position', '>=', $data['position'])
                ->increment('position');

            $task->update($data);
        });

        return $task->fresh()->load('status');
    }

    /**
     * Return KPI summary counts for the current user's allowed scope and filters.
     */
    public function summary(Request $request)
    {
        $user = $request->user();

        $base = Task::query()->allowed($user);

        // Apply same filters as index
        if ($request->filled('activity_id')) {
            $base->where('activity_id', (int) $request->input('activity_id'));
        }
        if ($request->filled('program_id')) {
            $programId = (int) $request->input('program_id');
            $base->whereHas('activity.program', function ($q) use ($programId) {
                $q->where('id', $programId);
            });
        }
        if ($request->filled('region')) {
            $region = $request->input('region');
            $base->whereHas('activity.program', function ($q) use ($region) {
                $q->where('region', $region);
            });
        }
        if ($request->filled('assignee_id')) {
            $base->where('assignee_id', (int) $request->input('assignee_id'));
        }
        if ($request->filled('priority')) {
            $base->where('priority', $request->input('priority'));
        }
        if ($request->filled('date_from')) {
            $base->whereDate('due_date', '>=', $request->input('date_from'));
        }
        if ($request->filled('date_to')) {
            $base->whereDate('due_date', '<=', $request->input('date_to'));
        }

        $today = now()->toDateString();

        $completedId = TaskStatus::where('slug', 'completed')->value('id');
        $pendingIds = TaskStatus::whereIn('slug', ['pending_tl','pending_supervisor','pending_regional'])->pluck('id');

        $summary = [
            'overdue' => (clone $base)->whereNotNull('due_date')
                ->whereDate('due_date', '<', $today)
                ->when($completedId, fn($q) => $q->where('status_id', '!=', $completedId))
                ->count(),
            'due_today' => (clone $base)->whereNotNull('due_date')
                ->whereDate('due_date', '=', $today)
                ->when($completedId, fn($q) => $q->where('status_id', '!=', $completedId))
                ->count(),
            'awaiting_approval' => (clone $base)
                ->when($pendingIds->isNotEmpty(), fn($q) => $q->whereIn('status_id', $pendingIds))
                ->count(),
            'in_progress' => (clone $base)
                ->when($pendingIds->isNotEmpty(), fn($q) => $q->whereIn('status_id', $pendingIds))
                ->count(),
            'completed' => (clone $base)
                ->when($completedId, fn($q) => $q->where('status_id', $completedId))
                ->count(),
        ];

        return response()->json($summary);
    }
}
