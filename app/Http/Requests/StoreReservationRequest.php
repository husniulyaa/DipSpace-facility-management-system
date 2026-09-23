<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'facility_id' => [
                'required',
                'integer',
                'exists:facilities,id',
            ],
            'reservation_date' => [
                'required',
                'date',
            ],
            'start_time' => [
                'required',
                'date_format:H:i',
            ],
            'end_time' => [
                'required',
                'date_format:H:i',
                'after:start_time',
            ],
            'purpose' => [
                'required',
                'string',
                'min:5',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'facility_id.required' => 'Fasilitas wajib dipilih.',
            'facility_id.exists' => 'Fasilitas tidak ditemukan.',
            'reservation_date.required' => 'Tanggal reservasi wajib diisi.',
            'reservation_date.date' => 'Format tanggal reservasi tidak valid.',
            'start_time.required' => 'Jam mulai wajib diisi.',
            'start_time.date_format' => 'Format jam mulai harus HH:MM.',
            'end_time.required' => 'Jam selesai wajib diisi.',
            'end_time.date_format' => 'Format jam selesai harus HH:MM.',
            'end_time.after' => 'Jam selesai harus setelah jam mulai.',
            'purpose.required' => 'Keperluan reservasi wajib diisi.',
            'purpose.min' => 'Keperluan reservasi minimal 5 karakter.',
        ];
    }
}