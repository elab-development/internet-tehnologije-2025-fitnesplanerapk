<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCiljRequest extends FormRequest
{
   
    public function authorize(): bool
    {
        
        return auth()->check();
    }

   
    public function rules(): array
    {
        return [
            'hidriranost' => 'required|numeric|min:0|max:100', 
            'tezina' => 'required|numeric|min:0|max:500', 
            'kalorije' => 'required|integer|min:0|max:10000', 
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
