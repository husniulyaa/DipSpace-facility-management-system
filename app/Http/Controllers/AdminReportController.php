<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\Reservation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminReportController extends Controller
{
    public function recap(Request $request): JsonResponse
    {
        $queryReservations = Reservation::query();
        $queryReports = Report::query();

        // Memfilter data rekap berdasarkan tanggal mulai jika diberikan.
        if ($request->filled('start_date')) {
            $queryReservations->whereDate(
                'reservation_date',
                '>=',
                $request->start_date
            );

            $queryReports->whereDate(
                'created_at',
                '>=',
                $request->start_date
            );
        }

        // Memfilter data rekap berdasarkan tanggal selesai jika diberikan.
        if ($request->filled('end_date')) {
            $queryReservations->whereDate(
                'reservation_date',
                '<=',
                $request->end_date
            );

            $queryReports->whereDate(
                'created_at',
                '<=',
                $request->end_date
            );
        }

        // Mengambil reservasi yang telah disetujui beserta data fasilitasnya.
        $reservations = $queryReservations
            ->where('status', 'disetujui')
            ->with('facility')
            ->get();

        $reports = $queryReports
            ->with('facility')
            ->get();

        // Menghitung jumlah reservasi yang disetujui pada setiap fasilitas.
        $occupancy = $reservations
            ->groupBy('facility_id')
            ->map(function ($facilityReservations) {
                $facility = $facilityReservations->first()->facility;

                return [
                    'facility_id' => $facility->id,
                    'facility_name' => $facility->name,
                    'reservation_count' => $facilityReservations->count(),
                ];
            })
            ->values();

        // Menghitung jumlah laporan kerusakan pada setiap fasilitas.
        $damageFrequency = $reports
            ->groupBy('facility_id')
            ->map(function ($facilityReports) {
                $facility = $facilityReports->first()->facility;

                return [
                    'facility_id' => $facility->id,
                    'facility_name' => $facility->name,
                    'damage_report_count' => $facilityReports->count(),
                ];
            })
            ->values();

        return response()->json([
            'period' => [
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
            ],
            'occupancy' => $occupancy,
            'damage_frequency' => $damageFrequency,
        ]);
    }

    public function export(Request $request)
    {
        $queryReservations = Reservation::query()
            ->where('status', 'disetujui');

        $queryReports = Report::query();

        // Memfilter data ekspor berdasarkan tanggal mulai jika diberikan.
        if ($request->filled('start_date')) {
            $queryReservations->whereDate(
                'reservation_date',
                '>=',
                $request->start_date
            );

            $queryReports->whereDate(
                'created_at',
                '>=',
                $request->start_date
            );
        }

        // Memfilter data ekspor berdasarkan tanggal selesai jika diberikan.
        if ($request->filled('end_date')) {
            $queryReservations->whereDate(
                'reservation_date',
                '<=',
                $request->end_date
            );

            $queryReports->whereDate(
                'created_at',
                '<=',
                $request->end_date
            );
        }

        $reservations = $queryReservations
            ->with('facility')
            ->get();

        $reports = $queryReports
            ->with('facility')
            ->get();

        // Menyiapkan data reservasi dan laporan untuk diekspor ke CSV.
        $rows = [];

        foreach ($reservations as $reservation) {
            $rows[] = [
                'jenis_rekap' => 'okupansi',
                'facility_id' => $reservation->facility_id,
                'facility_name' => $reservation->facility->name,
                'jumlah' => 1,
            ];
        }

        foreach ($reports as $report) {
            $rows[] = [
                'jenis_rekap' => 'frekuensi_kerusakan',
                'facility_id' => $report->facility_id,
                'facility_name' => $report->facility->name,
                'jumlah' => 1,
            ];
        }

        $filename = 'rekap-siaga-dips.csv';
        $handle = fopen('php://temp', 'w+');

        // Membuat header dan isi file CSV.
        fputcsv($handle, [
            'jenis_rekap',
            'facility_id',
            'facility_name',
            'jumlah',
        ]);

        foreach ($rows as $row) {
            fputcsv($handle, $row);
        }

        rewind($handle);

        $csv = stream_get_contents($handle);

        fclose($handle);

        // Mengirim file CSV sebagai response yang dapat diunduh.
        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header(
                'Content-Disposition',
                'attachment; filename="' . $filename . '"'
            );
    }
}