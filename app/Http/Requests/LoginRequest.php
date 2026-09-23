<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => [
                'required',
                'email',
                'regex:/^[^@\s]+@(students|lectures|staff|facility|admin)\.undip\.ac\.id$/',
            ],
            'password' => [
                'required',
                'string',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.regex' => 'Gunakan email resmi UNDIP yang diperbolehkan.',
            'password.required' => 'Password wajib diisi.',
        ];
    }
}