<?php

namespace App\Http\Controllers;

use App\Http\Requests\CancelApprovedReservationRequest;
use App\Http\Requests\CancelReservationRequest;
use App\Http\Requests\StoreReservationRequest;
use App\Http\Requests\UpdateReservationStatusRequest;
use App\Models\Facility;
use App\Models\Reservation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function store(StoreReservationRequest $request): JsonResponse
    {
        $user = $request->user();
        $now = now();

        // Booking hanya dapat dilakukan pada jam operasional 07:00 sampai 20:00.
        $currentMinutes = ($now->hour * 60) + $now->minute;
        $bookingStartMinutes = 7 * 60;
        $bookingEndMinutes = 20 * 60;

        if (
            $currentMinutes < $bookingStartMinutes ||
            $currentMinutes >= $bookingEndMinutes
        ) {
            return response()->json([
                'message' => 'Booking hanya dapat dilakukan pada pukul 07:00 sampai 20:00.',
            ], 422);
        }

        // Reservasi hanya dapat dilakukan pada fasilitas yang berstatus aktif.
        $facility = Facility::find($request->facility_id);

        if (!$facility || $facility->status !== 'aktif') {
            return response()->json([
                'message' => 'Fasilitas tidak tersedia untuk reservasi.',
            ], 422);
        }

        $startTime = $request->start_time;
        $endTime = $request->end_time;

        // Waktu penggunaan fasilitas dibatasi dari 06:00 sampai 23:00.
        if ($startTime < '06:00' || $endTime > '23:00') {
            return response()->json([
                'message' => 'Waktu penggunaan fasilitas hanya dapat dipilih antara pukul 06:00 sampai 23:00.',
            ], 422);
        }

        $startMinutes = $this->timeToMinutes($startTime);
        $endMinutes = $this->timeToMinutes($endTime);

        // Waktu reservasi harus menggunakan interval kelipatan 30 menit.
        if ($startMinutes % 30 !== 0 || $endMinutes % 30 !== 0) {
            return response()->json([
                'message' => 'Waktu reservasi harus menggunakan interval 30 menit.',
            ], 422);
        }

        if ($endMinutes <= $startMinutes) {
            return response()->json([
                'message' => 'Jam selesai harus setelah jam mulai.',
            ], 422);
        }

        // Reservasi menunggu maupun disetujui akan memblokir jadwal yang bertabrakan.
        $hasConflict = Reservation::where('facility_id', $facility->id)
            ->where('reservation_date', $request->reservation_date)
            ->whereIn('status', ['menunggu', 'disetujui'])
            ->where(function ($query) use ($startTime, $endTime) {
                $query
                    ->where('start_time', '<', $endTime)
                    ->where('end_time', '>', $startTime);
            })
            ->exists();

        if ($hasConflict) {
            return response()->json([
                'message' => 'Jadwal reservasi bentrok dengan reservasi lain.',
            ], 422);
        }

        // Menyimpan reservasi baru dengan status awal menunggu.
        $reservation = Reservation::create([
            'user_id' => $user->id,
            'facility_id' => $facility->id,
            'reservation_date' => $request->reservation_date,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'purpose' => $request->purpose,
            'status' => 'menunggu',
        ]);

        return response()->json([
            'message' => 'Reservasi berhasil diajukan.',
            'data' => $reservation->load('facility'),
        ], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $reservations = Reservation::with('facility')
            ->where('user_id', $request->user()->id)
            ->orderByDesc('reservation_date')
            ->orderByDesc('start_time')
            ->get();

        return response()->json([
            'data' => $reservations,
        ]);
    }

    public function show(
        Request $request,
        Reservation $reservation
    ): JsonResponse {
        // Pengguna hanya dapat melihat reservasi miliknya sendiri.
        if ($reservation->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Anda tidak memiliki akses ke reservasi ini.',
            ], 403);
        }

        return response()->json([
            'data' => $reservation->load('facility'),
        ]);
    }

    public function cancel(
        CancelReservationRequest $request,
        Reservation $reservation
    ): JsonResponse {
        // Pengguna hanya dapat membatalkan reservasi miliknya sendiri.
        if ($reservation->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Anda tidak memiliki akses ke reservasi ini.',
            ], 403);
        }

        // Reservasi yang sudah dibatalkan atau ditolak tidak dapat dibatalkan kembali.
        if (in_array($reservation->status, ['dibatalkan', 'ditolak'], true)) {
            return response()->json([
                'message' => 'Reservasi ini tidak dapat dibatalkan.',
            ], 422);
        }

        // Batas pembatalan adalah 24 jam sebelum waktu mulai reservasi.
        $reservationStart = $reservation->reservation_date->copy()
            ->setTimeFromTimeString($reservation->start_time);

        $cancellationDeadline = $reservationStart->copy()->subHours(24);

        if (now()->greaterThanOrEqualTo($cancellationDeadline)) {
            return response()->json([
                'message' => 'Reservasi tidak dapat dibatalkan karena sudah melewati batas H-24 jam sebelum waktu penggunaan.',
            ], 422);
        }

        $reservation->update([
            'status' => 'dibatalkan',
        ]);

        return response()->json([
            'message' => 'Reservasi berhasil dibatalkan.',
            'data' => $reservation->fresh()->load('facility'),
        ]);
    }

    public function petugasIndex(): JsonResponse
    {
        $reservations = Reservation::with([
            'user',
            'facility',
        ])
            ->orderByDesc('reservation_date')
            ->orderByDesc('start_time')
            ->get();

        return response()->json([
            'data' => $reservations,
        ]);
    }

    public function petugasShow(Reservation $reservation): JsonResponse
    {
        return response()->json([
            'data' => $reservation->load([
                'user',
                'facility',
            ]),
        ]);
    }

    public function updateStatus(
        UpdateReservationStatusRequest $request,
        Reservation $reservation
    ): JsonResponse {
        $newStatus = $request->status;

        // Hanya reservasi berstatus menunggu yang dapat diproses oleh Petugas.
        if ($reservation->status !== 'menunggu') {
            return response()->json([
                'message' => 'Reservasi ini sudah diproses dan tidak dapat diubah lagi.',
            ], 422);
        }

        // Reservasi yang ditolak langsung diubah menjadi status ditolak.
        if ($newStatus === 'ditolak') {
            $reservation->update([
                'status' => 'ditolak',
                'rejection_reason' => $request->rejection_reason,
            ]);

            return response()->json([
                'message' => 'Reservasi berhasil ditolak.',
                'data' => $reservation->fresh()->load([
                    'user',
                    'facility',
                ]),
            ]);
        }

        // Reservasi hanya dapat disetujui jika fasilitas masih berstatus aktif.
        $facility = Facility::find($reservation->facility_id);

        if (!$facility || $facility->status !== 'aktif') {
            return response()->json([
                'message' => 'Reservasi tidak dapat disetujui karena fasilitas tidak aktif.',
            ], 422);
        }

        // Memastikan kembali tidak ada jadwal yang bertabrakan sebelum reservasi disetujui.
        $hasConflict = Reservation::where('facility_id', $reservation->facility_id)
            ->where('reservation_date', $reservation->reservation_date)
            ->whereIn('status', ['menunggu', 'disetujui'])
            ->where('id', '!=', $reservation->id)
            ->where(function ($query) use ($reservation) {
                $query
                    ->where('start_time', '<', $reservation->end_time)
                    ->where('end_time', '>', $reservation->start_time);
            })
            ->exists();

        if ($hasConflict) {
            return response()->json([
                'message' => 'Reservasi tidak dapat disetujui karena jadwal bentrok dengan reservasi lain.',
            ], 422);
        }

        $reservation->update([
            'status' => 'disetujui',
        ]);

        return response()->json([
            'message' => 'Reservasi berhasil disetujui.',
            'data' => $reservation->fresh()->load([
                'user',
                'facility',
            ]),
        ]);
    }

    public function petugasCancel(
        CancelApprovedReservationRequest $request,
        Reservation $reservation
    ): JsonResponse {
        // Petugas hanya dapat membatalkan reservasi yang sudah disetujui.
        if ($reservation->status !== 'disetujui') {
            return response()->json([
                'message' => 'Hanya reservasi yang sudah disetujui yang dapat dibatalkan oleh Petugas.',
            ], 422);
        }

        $reservation->update([
            'status' => 'dibatalkan',
            'cancellation_reason' => $request->cancellation_reason,
        ]);

        return response()->json([
            'message' => 'Reservasi berhasil dibatalkan oleh Petugas.',
            'data' => $reservation->fresh()->load([
                'user',
                'facility',
            ]),
        ]);
    }

    private function timeToMinutes(string $time): int
    {
        [$hour, $minute] = array_map('intval', explode(':', $time));

        return ($hour * 60) + $minute;
    }
}