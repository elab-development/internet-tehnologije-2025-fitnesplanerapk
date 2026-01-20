
<?php
use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::middleware('cors')->get('/user', function (Request $request) {
//     return $request->user();
// });
// Route::middleware('cors')->group(function () {
//     Route::post('/register', [App\Http\Controllers\Api\AuthController::class, 'register']);
// });


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);