<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Activity;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function index()
    {
        return Activity::all();
    }
}
