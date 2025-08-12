<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Program;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProgramController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        return Program::with('manager')
            ->allowed($user)
            ->orderBy('name')
            ->get();
    }
}
