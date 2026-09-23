<?php

use App\Http\Controllers\AdminReportController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FacilityController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ReservationController;
use Illuminate\Support\Facades\Route;

// Route autentikasi.
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});

// Route fasilitas yang dapat diakses tanpa autentikasi.
Route::get('/facilities', [FacilityController::class, 'index']);
Route::get('/facilities/{facility}/availability', [FacilityController::class, 'availability']);
Route::get('/facilities/{facility}', [FacilityController::class, 'show']);

// Route khusus Admin.
Route::middleware(['auth:sanctum', 'role:admin'])
    ->prefix('admin')
    ->group(function () {
        Route::post('/facilities', [FacilityController::class, 'store']);
        Route::put('/facilities/{facility}', [FacilityController::class, 'update']);
        Route::patch('/facilities/{facility}/deactivate', [FacilityController::class, 'deactivate']);

        Route::post('/users', [AdminUserController::class, 'store']);
        Route::patch('/users/{user}/status', [AdminUserController::class, 'updateStatus']);

        Route::get('/reports/recap', [AdminReportController::class, 'recap']);
        Route::get('/reports/recap/export', [AdminReportController::class, 'export']);
    });

// Route khusus User.
Route::middleware(['auth:sanctum', 'role:user'])->group(function () {
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::get('/reservations/{reservation}', [ReservationController::class, 'show']);
    Route::patch('/reservations/{reservation}/cancel', [ReservationController::class, 'cancel']);

    Route::post('/reports', [ReportController::class, 'store']);
});

// Route khusus Petugas.
Route::middleware(['auth:sanctum', 'role:petugas'])
    ->prefix('petugas')
    ->group(function () {
        // Route pengelolaan reservasi.
        Route::get('/reservations', [ReservationController::class, 'petugasIndex']);
        Route::get('/reservations/{reservation}', [ReservationController::class, 'petugasShow']);
        Route::patch('/reservations/{reservation}/status', [ReservationController::class, 'updateStatus']);
        Route::patch('/reservations/{reservation}/cancel', [ReservationController::class, 'petugasCancel']);

        // Route pengelolaan laporan.
        Route::get('/reports', [ReportController::class, 'petugasIndex']);
        Route::get('/reports/{report}', [ReportController::class, 'petugasShow']);
        Route::patch('/reports/{report}/status', [ReportController::class, 'updateStatus']);

        // Route pengelolaan status fasilitas.
        Route::patch('/facilities/{facility}/maintenance', [FacilityController::class, 'maintenance']);
        Route::patch('/facilities/{facility}/restore', [FacilityController::class, 'restore']);
    });