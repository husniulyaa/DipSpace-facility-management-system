<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFacilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'sometimes',
                'string',
                'max:150',
            ],
            'type' => [
                'sometimes',
                'string',
                'max:50',
            ],
            'location' => [
                'sometimes',
                'string',
                'max:50',
            ],
            'capacity' => [
                'sometimes',
                'integer',
                'min:1',
            ],
            'description' => [
                'sometimes',
                'nullable',
                'string',
            ],
            'address' => [
                'sometimes',
                'nullable',
                'string',
            ],
            'image' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
            ],
            'status' => [
                'sometimes',
                Rule::in([
                    'aktif',
                    'maintenance',
                    'nonaktif',
                ]),
            ],
        ];
    }
}