
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
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

use App\Http\Controllers\HidriranostController;
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/obroci', [ObrokController::class, 'store']);
    Route::get('/obroci', [ObrokController::class, 'index']);
    Route::get('/hrana', [HranaController::class, 'index']);
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
Route::middleware('auth:sanctum')->delete('/cilj/{id}', [CiljController::class, 'destroy']);
Route::middleware('auth:sanctum')->delete('/parametar/{id}', [ParametriController::class, 'destroy']);


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
Route::middleware('auth:sanctum')->put('/obroci/{obrok}', [ObrokController::class, 'update']);

Route::middleware('auth:sanctum')->get('/programi/treneri', [ProgramController::class, 'treneriProgrami']);

Route::middleware('auth:sanctum')->get('/obroci/{id}', [ObrokController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::delete('/obroci/{obrok}', [ObrokController::class, 'destroy']);
});
// Korisnik dodaje svoj cilj
Route::middleware('auth:sanctum')->post('/cilj', [CiljController::class, 'store']);

// Trener dodaje cilj za vežbača
Route::middleware('auth:sanctum')->post('/users/{user}/ciljevi', [CiljController::class, 'store']);
Route::middleware('auth:sanctum')->get('/cilj', [CiljController::class, 'getCilj']);
Route::middleware('auth:sanctum')->get('/vezbaci', [UserController::class, 'vezbaciTrenera']);
Route::middleware('auth:sanctum')->get('/users/{user}/parametri', [UserController::class, 'parametri']);
Route::middleware('auth:sanctum')->get('/users/{user}/ciljevi', [UserController::class, 'ciljevi']);
Route::middleware('auth:sanctum')->get('/users/{user}', [UserController::class, 'show']);
Route::middleware('auth:sanctum')->get('/vezbac/{user}', [UserController::class, 'show']);
Route::middleware('auth:sanctum')->post('/users/{user}/parametri', [UserController::class, 'storeParametar']);
// Route::middleware('auth:sanctum')->get('/admin/users', [UsersController::class, 'index']);
// Uz middleware auth:sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/trener/pretraga', [UserController::class, 'pretragaTrenera']);
    Route::post('/trener/postavi', [UserController::class, 'postaviTrenera']);
    Route::post('/trener/ukloni', [UserController::class, 'ukloniTrenera']);
});
Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    $user = \App\Models\User::with('trener')->find($request->user()->id);
    return response()->json($user);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/trener/profil', [UserController::class, 'updateProfil']);
});
Route::middleware('auth:sanctum')->post('/programi/dodaj-veze', [ProgramController::class, 'dodajVezbe']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/hidriranost', [HidriranostController::class, 'index']); 
});


Route::middleware('auth:sanctum')->get('/exercises', function () {
    return Cache::remember('all_exercises', 86400, function () {
        $response = Http::withHeaders([
            'X-RapidAPI-Key' => '4cbb324438msh1395f1685da7781p1326c4jsnbd209dcfb79a',
            'X-RapidAPI-Host' => 'exercisedb.p.rapidapi.com'
        ])->get('https://exercisedb.p.rapidapi.com/exercises?limit=21'); 
        if ($response->failed()) {
            return response()->json([
                'error' => 'API poziv nije uspeo',
                'status' => $response->status(),
                'body' => $response->json() 
            ], 500);
        }
        return $response->json();
    });
});