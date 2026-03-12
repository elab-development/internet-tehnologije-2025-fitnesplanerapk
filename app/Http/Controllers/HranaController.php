<?php

namespace App\Http\Controllers;

use App\Models\Hrana;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;
class HranaController extends Controller
{
    #[OA\Get(
        path: "/hrana",
        summary: "Prikaz svih namirnica iz baze",
        description: "Vraća listu svih dostupnih namirnica sa njihovim kalorijskim vrednostima.",
        tags: ["Hrana"],
        security: [["sanctum" => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: "Uspešno vraćena lista hrane",
                content: new OA\JsonContent(
                    type: "array",
                    items: new OA\Items(
                        properties: [
                            new OA\Property(property: "id", type: "integer", example: 1),
                            new OA\Property(property: "naziv", type: "string", example: "Belo meso"),
                            new OA\Property(property: "kalorije", type: "integer", example: 165),
                            new OA\Property(property: "created_at", type: "string", format: "date-time"),
                            new OA\Property(property: "updated_at", type: "string", format: "date-time")
                        ]
                    )
                )
            ),
            new OA\Response(response: 401, description: "Niste ulogovani")
        ]
    )]
    public function index()
    {
        $hrana = Hrana::all();
        return response()->json($hrana);
    }
}
