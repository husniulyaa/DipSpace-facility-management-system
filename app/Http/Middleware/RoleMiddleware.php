<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(
        Request $request,
        Closure $next,
        ...$roles
    ): Response {
        $user = $request->user();

        // Memastikan pengguna sudah terautentikasi sebelum mengakses fitur.
        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        // Memastikan role pengguna memiliki izin untuk mengakses fitur.
        if (!in_array($user->role, $roles, true)) {
            return response()->json([
                'message' => 'Anda tidak memiliki akses ke fitur ini.',
            ], 403);
        }

        return $next($request);
    }
}