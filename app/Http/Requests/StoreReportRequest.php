<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReportRequest extends FormRequest
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
            'category' => [
                'required',
                'string',
                'in:Fasilitas rusak,Peralatan rusak,Kebersihan,Kelistrikan,Jaringan/Internet,Keamanan,Lainnya',
            ],
            'description' => [
                'required',
                'string',
                'min:10',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'facility_id.required' => 'Fasilitas wajib dipilih.',
            'facility_id.exists' => 'Fasilitas tidak ditemukan.',
            'category.required' => 'Kategori kerusakan wajib diisi.',
            'category.in' => 'Kategori laporan tidak valid.',
            'description.required' => 'Deskripsi kerusakan wajib diisi.',
            'description.min' => 'Deskripsi kerusakan minimal 10 karakter.',
        ];
    }
}