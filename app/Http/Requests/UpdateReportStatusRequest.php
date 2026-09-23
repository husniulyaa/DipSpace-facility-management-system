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
            'rejection_reason' => [
                'required_if:status,Ditolak',
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
            'rejection_reason.required_if' => 'Alasan penolakan wajib diisi.',
        ];
    }
}