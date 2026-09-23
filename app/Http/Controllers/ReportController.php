<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateReportStatusRequest;
use App\Http\Requests\StoreReportRequest;
use App\Models\Report;
use Illuminate\Http\JsonResponse;

class ReportController extends Controller
{
    public function store(StoreReportRequest $request): JsonResponse
    {
        $report = Report::create([
            'user_id' => $request->user()->id,
            'facility_id' => $request->facility_id,
            'category' => $request->category,
            'location_detail' => $request->location_detail,
            'description' => $request->description,
            'status' => 'Baru',
            'resolution_note' => null,
        ]);

        return response()->json([
            'message' => 'Laporan kerusakan berhasil dikirim.',
            'data' => $report->load('facility'),
        ], 201);
    }

    public function petugasIndex(): JsonResponse
    {
        $reports = Report::with([
            'user',
            'facility',
        ])
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'data' => $reports,
        ]);
    }

    public function petugasShow(Report $report): JsonResponse
    {
        return response()->json([
            'data' => $report->load([
                'user',
                'facility',
            ]),
        ]);
    }

    public function updateStatus(
        UpdateReportStatusRequest $request,
        Report $report
    ): JsonResponse {
        $newStatus = $request->status;

        if (
            $newStatus === 'Selesai' &&
            blank($request->resolution_note)
        ) {
            return response()->json([
                'message' => 'Catatan penyelesaian wajib diisi jika laporan berstatus Selesai.',
            ], 422);
        }

        if (
            $newStatus === 'Diproses' &&
            $report->status !== 'Baru'
        ) {
            return response()->json([
                'message' => 'Laporan hanya dapat diproses jika statusnya masih Baru.',
            ], 422);
        }

        if (
            $newStatus === 'Selesai' &&
            $report->status !== 'Diproses'
        ) {
            return response()->json([
                'message' => 'Laporan hanya dapat diselesaikan jika statusnya Diproses.',
            ], 422);
        }

        if (
            $newStatus === 'Ditolak' &&
            !in_array($report->status, ['Baru', 'Diproses'], true)
        ) {
            return response()->json([
                'message' => 'Laporan hanya dapat ditolak jika statusnya Baru atau Diproses.',
            ], 422);
        }

        $report->update([
            'status' => $newStatus,
            'resolution_note' => $newStatus === 'Selesai'
                ? $request->resolution_note
                : $report->resolution_note,
            'rejection_reason' => $newStatus === 'Ditolak'
                ? $request->rejection_reason
                : $report->rejection_reason,
        ]);

        return response()->json([
            'message' => 'Status laporan berhasil diperbarui.',
            'data' => $report->fresh()->load([
                'user',
                'facility',
            ]),
        ]);
    }
}