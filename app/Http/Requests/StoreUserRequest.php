<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
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
            ],
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/[a-z]/',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
                'regex:/[^A-Za-z0-9]/',
                'confirmed',
            ],
            'role' => [
                'required',
                Rule::in([
                    'user',
                    'petugas',
                ]),
            ],
            'status' => [
                'nullable',
                Rule::in([
                    'pending',
                    'aktif',
                ]),
            ],
        ];
    }
}