
<?php
use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\CiljController;
use App\Http\Controllers\ParametriController;
use App\Http\Controllers\ObrokController;
use App\Http\Controllers\HranaController;
use App\Http\Controllers\VezbaController;
use App\Http\Controllers\ProgramController;
use App\Models\Vezba;
use App\Models\Program;



use App\Http\Controllers\HidriranostController;
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/obroci', [ObrokController::class, 'store']);
    Route::get('/obroci', [ObrokController::class, 'index']);
    Route::get('/hrana', [HranaController::class, 'index']);
});



// Route::middleware('cors')->get('/user', function (Request $request) {
//     return $request->user();
// });
// Route::middleware('cors')->group(function () {
//     Route::post('/register', [App\Http\Controllers\Api\AuthController::class, 'register']);
// });
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/obrociPregled', [ObrokController::class, 'pregled']);
});
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/obrociPregled', [ObrokController::class, 'obrociPregled']);
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

Route::middleware('auth:sanctum')->post('/parametri', [ParametriController::class, 'store']);


Route::middleware('auth:sanctum')->get('/cilj', [CiljController::class, 'index']);

Route::middleware('auth:sanctum')->get('/parametri', [ParametriController::class, 'index']);

Route::middleware('auth:sanctum')->get('/all-ciljevi', [CiljController::class, 'allCilj']);
Route::middleware('auth:sanctum')->get('/all-parametri', [ParametriController::class, 'allParametri']);

Route::middleware('auth:sanctum')->get('/vezbe', [VezbaController::class, 'index']);
Route::middleware('auth:sanctum')->post('/vezbe', [VezbaController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/hidriranost-danas', [HidriranostController::class, 'danas']);
    Route::post('/hidriranost', [HidriranostController::class, 'store']);
    //Route::put('/hidriranost', [HidriranostController::class, 'update']);
    Route::put('/hidriranost/{hidriranost}', [HidriranostController::class, 'update']);

});


Route::middleware('auth:sanctum')->get('/programi', [ProgramController::class, 'index']);
Route::middleware('auth:sanctum')->post('/programi', [ProgramController::class, 'store']);
Route::middleware('auth:sanctum')->delete('/programi/{id}', [ProgramController::class, 'destroy']);


//ovo je za proveru, posle brisem
Route::get('/test/vezbe', function () {
    return Vezba::all();
});

Route::get('/test/programi', function () {
    return Program::with('vezbe')->get();
});


// Route::middleware('auth:sanctum')->get('/admin/users', [UsersController::class, 'index']);
