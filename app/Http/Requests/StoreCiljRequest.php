<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCiljRequest extends FormRequest
{
   
    public function authorize(): bool
    {
        // korisnik mora biti ulogovan da bi mogao da doda cilj
        return auth()->check();
    }

   
    public function rules(): array
    {
        return [
            'hidriranost' => 'required|numeric|min:0|max:100', // % ili litar
            'tezina' => 'required|numeric|min:0|max:500', // kg, podesiti po logici
            'kalorije' => 'required|integer|min:0|max:10000', // dnevni kalorijski cilj
        ];
    }

    
    public function messages(): array
    {
        return [
            'hidriranost.required' => 'Polje hidriranost je obavezno.',
            'hidriranost.numeric' => 'Hidriranost mora biti broj.',
            'tezina.required' => 'Polje težina je obavezno.',
            'tezina.numeric' => 'Težina mora biti broj.',
            'kalorije.required' => 'Polje kalorije je obavezno.',
            'kalorije.integer' => 'Kalorije moraju biti ceo broj.',
        ];
    }
}
