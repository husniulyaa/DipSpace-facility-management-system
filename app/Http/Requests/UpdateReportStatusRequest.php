<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateReportStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => [
                'required',
                Rule::in([
                    'Diproses',
                    'Selesai',
                    'Ditolak',
                ]),
            ],
            'resolution_note' => [
                'nullable',
                'string',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Status laporan wajib diisi.',
            'status.in' => 'Status laporan tidak valid.',
        ];
    }
}