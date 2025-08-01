<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Task;
use App\Models\TaskStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TaskController extends Controller
{
    /**
     * List tasks, optionally filtered by activity or status.
     */
    public function index(Request $request)
    {
        $query = Task::with(['activity', 'assignee', 'status']);

        if ($request->filled('activity_id')) {
            $query->where('activity_id', $request->integer('activity_id'));
        }

        if ($request->filled('status_id')) {
            $query->where('status_id', $request->integer('status_id'));
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
}
