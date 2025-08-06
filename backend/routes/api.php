<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\StakeholderController;
use App\Http\Controllers\Api\V1\ProgramController;
use App\Http\Controllers\Api\V1\ActivityController;
use App\Http\Controllers\Api\V1\TaskController;
use App\Http\Controllers\Api\AuthController;
use Illuminate\Routing\Middleware\ThrottleRequests;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Dev auth login route
Route::post('/login', [AuthController::class, 'login'])
    ->withoutMiddleware([ThrottleRequests::class]);

Route::get('/status', function () {
    return response()->json(['status' => 'API is running']);
});

Route::options('/{any}', function () {
    return response()->json([], 204)->withHeaders([
        'Access-Control-Allow-Origin' => '*',
        'Access-Control-Allow-Headers' => '*',
        'Access-Control-Allow-Methods' => 'GET, POST, OPTIONS',
    ]);
})->where('any', '.*');

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('v1/stakeholders', StakeholderController::class);
    Route::apiResource('v1/programs', ProgramController::class);
    Route::apiResource('v1/activities', ActivityController::class);
    Route::apiResource('v1/tasks', TaskController::class);
    Route::get('v1/task-statuses', [\App\Http\Controllers\Api\V1\TaskStatusController::class, 'index']);
    Route::post('v1/tasks/{task}/move', [TaskController::class, 'move']);
});
