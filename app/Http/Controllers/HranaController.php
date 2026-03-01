<?php

namespace App\Http\Controllers;

use App\Models\Hrana;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA; 
class HranaController extends Controller
{
    /**
 * @OA\Get(
 *     path="/api/hrana",
 *     summary="Lista hrane",
 *     tags={"Hrana"},
 *     security={{"sanctum":{}}},
 *     @OA\Response(response=200, description="Lista hrane")
 * )
 */
    public function index()
    {
        $hrana = Hrana::all();
        return response()->json($hrana);
    }
}
