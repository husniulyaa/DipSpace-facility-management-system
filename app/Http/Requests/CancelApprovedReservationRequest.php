<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CancelApprovedReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cancellation_reason' => [
                'required',
                'string',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'cancellation_reason.required' => 'Alasan pembatalan wajib diisi.',
        ];
    }
}