
<?php
use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\CiljController;

// Route::middleware('cors')->get('/user', function (Request $request) {
//     return $request->user();
// });
// Route::middleware('cors')->group(function () {
//     Route::post('/register', [App\Http\Controllers\Api\AuthController::class, 'register']);
// });
use App\Http\Controllers\Api\FoodController;

Route::middleware('auth:sanctum')->group(function () {
    // Dobavljanje obroka za trenutnog korisnika za danas
    Route::get('/obroci', [FoodController::class, 'index']);

    // Dodavanje novog obroka
    Route::post('/obroci', [FoodController::class, 'store']);

    // Brisanje obroka
    Route::delete('/obroci/{id}', [FoodController::class, 'destroy']);
});


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin/users', [UserController::class, 'allUsers']);
});

Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return response()->json($request->user());
});



Route::middleware('auth:sanctum')->post('/cilj', [CiljController::class, 'store']);


// Route::middleware('auth:sanctum')->get('/admin/users', [UsersController::class, 'index']);
