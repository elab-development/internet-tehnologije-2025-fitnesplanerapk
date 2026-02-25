<?php

namespace App\Http\Controllers\Api;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
class UserController extends Controller
{
    /**
     * Prikazuje sve korisnike koji su vezbači ili admini
     */
    public function vezbaciTrenera()
{
    $user = auth()->user();

    if ($user->uloga_id !== 3) { // 3 = trener
        return response()->json(['message' => 'Nije trener'], 403);
    }

    // Dohvat svih vezbača koji imaju ovog trenera
    $vezbaci = User::where('trener_id', $user->id)
        ->select('id', 'ime', 'prezime', 'email', 'username')
        ->get();

    return response()->json($vezbaci);
}
public function parametri(User $user) {
    return response()->json($user->parametri);
}

public function ciljevi(User $user) {
    return response()->json($user->ciljevi);
}
public function pretragaTrenera(Request $request)
{
    $query = $request->query('query');

    if (!$query) {
        return response()->json([]);
    }

    $treneri = User::whereHas('uloga', function($q) {
                    $q->where('ime', 'trener');
                })
                ->where(function($q) use ($query) {
                    $q->where('ime', 'like', "%{$query}%")
                      ->orWhere('prezime', 'like', "%{$query}%")
                      ->orWhere('email', 'like', "%{$query}%");
                })
                ->get(['id', 'ime', 'prezime', 'email']);

    return response()->json($treneri);
}
public function postaviTrenera(Request $request)
{
    $request->validate([
        'trener_id' => 'required|exists:users,id'
    ]);

    $korisnik = Auth::user();

    $trener = User::where('id', $request->trener_id)
                  ->whereHas('uloga', function($q){
                      $q->where('ime', 'trener');
                  })
                  ->first();

    if (!$trener) {
        return response()->json(['message' => 'Izabrani korisnik nije trener'], 400);
    }

    $korisnik->trener_id = $trener->id;
    $korisnik->save();

    return response()->json([
        'message' => 'Trener uspešno postavljen',
        'trener' => $trener->only(['id','ime','prezime','email'])
    ]);
}

public function updateProfil(Request $request)
{
    $user = auth()->user();

    if (!$user->isTrener()) {
        return response()->json(['message' => 'Nemate dozvolu.'], 403);
    }

    // Validacija
    $data = $request->validate([
        'ime' => 'required|string|max:255',
        'prezime' => 'required|string|max:255',
        'username' => 'required|string|max:255|unique:users,username,' . $user->id,
        'email' => 'required|email|unique:users,email,' . $user->id,
        'password' => 'nullable|min:6|confirmed', // potvrda lozinke
        'biografija' => 'nullable|string',
        'profile_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
    ]);

    // Upload slike
    if ($request->hasFile('profile_image')) {
        if ($user->profile_image) {
            Storage::disk('public')->delete($user->profile_image);
        }

        $path = $request->file('profile_image')->store('profile_images', 'public');
        $data['profile_image'] = $path;
    }

    // Lozinka
    if (!empty($data['password'])) {
        $data['password'] = Hash::make($data['password']);
    } else {
        unset($data['password']);
    }

    // Update korisnika
    $user->update($data);

    return response()->json([
        'message' => 'Profil uspešno ažuriran',
        'user' => $user
    ]);
}
public function ukloniTrenera()
{
    $korisnik = Auth::user();

    $korisnik->trener_id = null;
    $korisnik->save();

    return response()->json([
        'message' => 'Trener uklonjen'
    ]);
}
public function storeParametar(Request $request, User $user)
{

    // Opcionalno: samo trener može dodati parametre
    $authUser = auth()->user();
    if ($authUser->uloga_id !== 3) {
        return response()->json(['message' => 'Nije trener'], 403);
    }

    $request->validate([
        'date' => 'required|date',
        'tezina' => 'required|numeric',
        'visina' => 'required|numeric',
        'bmi' => 'required|numeric',
        'masti' => 'required|numeric',
        'misici' => 'required|numeric',
        'obim_struka' => 'required|numeric',
    ]);

    $param = $user->parametri()->create($request->all());

    return response()->json($param);
}
public function show(User $user) {
    $user->load('parametri', 'ciljevi'); // eager load
    return response()->json($user);
}
    public function allUsers()
    {
        return response()->json(
            User::whereIn('uloga_id', [1, 3]) // 1=korisnik, 3=trener
                ->select(
                    'id',
                    'ime',
                    'prezime',
                    'email',
                    'username',
                    'created_at'
                )->get()
        );
    }

    /**
     * Prikazuje sve korisnike (samo admin)
     */
    public function index()
    {
        $user = auth()->user();

        if ($user->uloga_id !== 2) { // 2 = admin
            return response()->json(['message' => 'Nije admin'], 403);
        }

        $users = User::all();
        return response()->json($users);
    }

    /**
     * Povezivanje vezbača sa trenerom
     * 
     * @param Request $request
     * $request->trener_id => ID trenera
     * $request->vezbac_id => ID vezbača
     */
    public function assignVezbacToTrener(Request $request)
    {
        $request->validate([
            'trener_id' => 'required|exists:users,id',
            'vezbac_id' => 'required|exists:users,id',
        ]);

        $trener = User::find($request->trener_id);
        $vezbac = User::find($request->vezbac_id);

        // Proveravamo da li su uloge ispravne
        if (!$trener->isTrener()) {
            return response()->json(['message' => 'Odabrani korisnik nije trener'], 400);
        }
        if (!$vezbac->isVezbac()) {
            return response()->json(['message' => 'Odabrani korisnik nije vezbač'], 400);
        }

        // Povezivanje vezbača sa trenerom
        $vezbac->trener()->associate($trener);
        $vezbac->save();

        return response()->json([
            'message' => 'Vezbač uspešno povezan sa trenerom',
            'vezbac' => $vezbac,
            'trener' => $trener
        ]);
    }

    /**
     * Dohvatanje svih vezbača određenog trenera
     */
    public function getVezbaciTrenera($trener_id)
    {
        $trener = User::findOrFail($trener_id);

        if (!$trener->isTrener()) {
            return response()->json(['message' => 'Korisnik nije trener'], 400);
        }

        $vezbaci = $trener->vezbaci;

        return response()->json($vezbaci);
    }

    /**
     * Dohvatanje trenera određenog vezbača
     */
    public function getTrenerVezbaca($vezbac_id)
    {
        $vezbac = User::findOrFail($vezbac_id);

        if (!$vezbac->isVezbac()) {
            return response()->json(['message' => 'Korisnik nije vezbač'], 400);
        }

        $trener = $vezbac->trener;

        return response()->json($trener);
    }
}