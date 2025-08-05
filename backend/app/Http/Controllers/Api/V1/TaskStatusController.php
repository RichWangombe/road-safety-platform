<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\TaskStatus;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class TaskStatusController extends Controller
{
    /**
     * Return ordered list of task statuses with colour hex.
     * Cached for 5 minutes because statuses are rarely modified.
     */
    public function index(): JsonResponse
    {
        $statuses = Cache::remember('task_statuses_v1', 300, function () {
            return TaskStatus::orderBy('position')->get(['id', 'name', 'slug', 'position', 'color']);
        });

        return response()->json($statuses);
    }
}
