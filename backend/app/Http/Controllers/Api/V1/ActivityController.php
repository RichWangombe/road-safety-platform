<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Activity;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Activity::with(['program'])->allowed($user)->orderBy('name');

        if ($request->filled('program_id')) {
            $query->where('program_id', (int) $request->input('program_id'));
        }

        return $query->get();
    }
}
