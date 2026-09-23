<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // Register pengguna baru.
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->name,
            'identity_number' => $request->identity_number,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => $request->password,
            'role' => 'user',
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Registrasi berhasil. Akun menunggu verifikasi.',
            'data' => $user,
        ], 201);
    }

    // Login pengguna.
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email atau password salah.',
            ], 401);
        }

        if ($user->status !== 'aktif') {
            return response()->json([
                'message' => 'Akun belum aktif atau belum diverifikasi.',
            ], 403);
        }

        $token = $user->createToken('siaga-dips-token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil.',
            'data' => [
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
            ],
        ]);
    }

    // Logout pengguna.
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil.',
        ]);
    }

    // Mendapatkan data pengguna yang sedang login.
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $request->user(),
        ]);
    }
}