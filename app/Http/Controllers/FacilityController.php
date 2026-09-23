<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFacilityRequest;
use App\Http\Requests\UpdateFacilityRequest;
use App\Models\Facility;
use App\Models\Reservation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FacilityController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Facility::query();

        // Memfilter fasilitas berdasarkan parameter pencarian yang diberikan.
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('location')) {
            $query->where('location', $request->location);
        }

        if ($request->filled('capacity')) {
            $query->where('capacity', '>=', $request->integer('capacity'));
        }

        $facilities = $query
            ->orderBy('name')
            ->get();

        return response()->json([
            'data' => $facilities,
        ]);
    }

    public function show(Facility $facility): JsonResponse
    {
        return response()->json([
            'data' => $facility,
        ]);
    }

    public function availability(
        Request $request,
        Facility $facility
    ): JsonResponse {
        $request->validate([
            'date' => ['required', 'date'],
        ]);

        $date = $request->date;

        // Mengambil reservasi aktif yang memengaruhi ketersediaan fasilitas.
        $reservations = Reservation::query()
            ->where('facility_id', $facility->id)
            ->whereDate('reservation_date', $date)
            ->whereIn('status', ['menunggu', 'disetujui'])
            ->get([
                'start_time',
                'end_time',
                'status',
            ]);

        $slots = [];

        // Membentuk slot penggunaan fasilitas setiap 30 menit dari 06:00 hingga 23:00.
        $startMinutes = 6 * 60;
        $endMinutes = 23 * 60;

        for (
            $current = $startMinutes;
            $current < $endMinutes;
            $current += 30
        ) {
            $slotStart = $current;
            $slotEnd = $current + 30;
            $slotStatus = 'tersedia';

            // Menentukan status setiap slot berdasarkan reservasi yang bertabrakan.
            foreach ($reservations as $reservation) {
                $reservationStart = $this->timeToMinutes(
                    $reservation->start_time
                );

                $reservationEnd = $this->timeToMinutes(
                    $reservation->end_time
                );

                $hasConflict =
                    $reservationStart < $slotEnd &&
                    $reservationEnd > $slotStart;

                if ($hasConflict) {
                    if ($reservation->status === 'disetujui') {
                        $slotStatus = 'tidak_tersedia';
                    } elseif ($reservation->status === 'menunggu') {
                        $slotStatus = 'menunggu';
                    }

                    break;
                }
            }

            $slots[] = [
                'start_time' => sprintf(
                    '%02d:%02d',
                    intdiv($slotStart, 60),
                    $slotStart % 60
                ),
                'end_time' => sprintf(
                    '%02d:%02d',
                    intdiv($slotEnd, 60),
                    $slotEnd % 60
                ),
                'status' => $slotStatus,
            ];
        }

        return response()->json([
            'facility' => [
                'id' => $facility->id,
                'name' => $facility->name,
                'status' => $facility->status,
            ],
            'date' => $date,
            'slots' => $slots,
        ]);
    }

    public function store(StoreFacilityRequest $request): JsonResponse
    {
        // Menambahkan fasilitas baru berdasarkan data yang telah divalidasi.
        $facility = Facility::create([
            'name' => $request->name,
            'type' => $request->type,
            'location' => $request->location,
            'capacity' => $request->capacity,
            'description' => $request->description,
            'address' => $request->address,
            'image' => $request->image,
            'status' => $request->status ?? 'aktif',
        ]);

        return response()->json([
            'message' => 'Fasilitas berhasil ditambahkan.',
            'data' => $facility,
        ], 201);
    }

    public function update(
        UpdateFacilityRequest $request,
        Facility $facility
    ): JsonResponse {
        // Memperbarui fasilitas menggunakan data yang telah divalidasi.
        $facility->update($request->validated());

        return response()->json([
            'message' => 'Fasilitas berhasil diperbarui.',
            'data' => $facility->fresh(),
        ]);
    }

    public function deactivate(Facility $facility): JsonResponse
    {
        $facility->update([
            'status' => 'nonaktif',
        ]);

        return response()->json([
            'message' => 'Fasilitas berhasil dinonaktifkan.',
            'data' => $facility->fresh(),
        ]);
    }

    public function maintenance(Facility $facility): JsonResponse
    {
        $facility->update([
            'status' => 'maintenance',
        ]);

        return response()->json([
            'message' => 'Fasilitas berhasil diubah ke status maintenance.',
            'data' => $facility->fresh(),
        ]);
    }

    public function restore(Facility $facility): JsonResponse
    {
        $facility->update([
            'status' => 'aktif',
        ]);

        return response()->json([
            'message' => 'Fasilitas berhasil diaktifkan kembali.',
            'data' => $facility->fresh(),
        ]);
    }

    private function timeToMinutes(string $time): int
    {
        [$hour, $minute] = array_map('intval', explode(':', $time));

        return ($hour * 60) + $minute;
    }
}