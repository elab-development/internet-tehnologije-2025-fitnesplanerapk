<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'ime'=>'required|string|max:55',
            'prezime'=>'required|string|max:55',
            'email'=>'required|email|unique:users,email',
            'username'=>'required|string|max:55',
            'password'=>[
                'required',
                Password::min(8)
                ->letters()
                ->symbols()
            ],
            'pol' => 'required|in:muski,zenski',
            'datumRodjenja' => 'required|date'
        ];
    }

    protected function failedValidation(Validator $validator)
{
    throw new HttpResponseException(
        response()->json(['errors' => $validator->errors()], 422)
    );
}
}
