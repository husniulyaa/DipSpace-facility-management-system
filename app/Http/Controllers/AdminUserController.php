<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserStatusRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminUserController extends Controller
{
    public function store(StoreUserRequest $request): JsonResponse
    {
        // Membuat akun baru berdasarkan data yang telah divalidasi.
        $user = User::create([
            'name' => $request->name,
            'identity_number' => $request->identity_number,
            'email' => $request->email,
            'password' => $request->password,
            'role' => $request->role,
            'status' => $request->status ?? 'aktif',
        ]);

        return response()->json([
            'message' => 'Akun berhasil dibuat.',
            'data' => $user,
        ], 201);
    }

    public function updateStatus(
        UpdateUserStatusRequest $request,
        User $user
    ): JsonResponse {
        // Memperbarui status akun pengguna.
        $user->update([
            'status' => $request->status,
        ]);

        return response()->json([
            'message' => 'Status akun berhasil diperbarui.',
            'data' => $user->fresh(),
        ]);
    }
}