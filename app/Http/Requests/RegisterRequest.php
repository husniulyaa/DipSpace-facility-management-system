<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:150',
            ],
            'identity_number' => [
                'required',
                'string',
                'max:50',
                'unique:users,identity_number',
            ],
            'email' => [
                'required',
                'email',
                'max:150',
                'unique:users,email',
                'regex:/^[^@\s]+@(students|lectures|staff)\.undip\.ac\.id$/',
            ],
            'phone' => [
                'nullable',
                'string',
                'max:20',
            ],
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/[a-z]/',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
                'regex:/[@$!%*?&#_]/',
                'confirmed',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama wajib diisi.',
            'identity_number.required' => 'NIM/NIP wajib diisi.',
            'identity_number.unique' => 'NIM/NIP sudah terdaftar.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah terdaftar.',
            'email.regex' => 'Email harus menggunakan domain email UNDIP yang diperbolehkan.',
            'password.required' => 'Password wajib diisi.',
            'password.min' => 'Password minimal 8 karakter.',
            'password.regex' => 'Password harus mengandung huruf kecil, huruf besar, angka, dan karakter khusus.',
            'password.confirmed' => 'Konfirmasi password tidak sesuai.',
        ];
    }
}