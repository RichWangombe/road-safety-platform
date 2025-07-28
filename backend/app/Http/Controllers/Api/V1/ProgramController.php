<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Program;
use Illuminate\Http\Request;

class ProgramController extends Controller
{
    public function index()
    {
        return Program::all();
    }
}
