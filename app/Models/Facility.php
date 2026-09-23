<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Facility extends Model
{
    protected $table = 'facilities';

    protected $fillable = [
        'name',
        'type',
        'location',
        'capacity',
        'description',
        'address',
        'image',
        'status',
    ];

    // Tabel facilities hanya menggunakan created_at tanpa updated_at.
    public const UPDATED_AT = null;

    protected function casts(): array
    {
        return [
            'capacity' => 'integer',
        ];
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }
}