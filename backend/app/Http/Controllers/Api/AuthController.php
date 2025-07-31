<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AuthController extends Controller
{
    /**
     * Simple dev-only login endpoint.
     * Accepts fixed credentials (admin@example.com / password) and returns
     * a dummy token + user payload so the React frontend can authenticate.
     * DO NOT use this in production – replace with proper auth.
     */
    public function login(Request $request)
    {
        $data = $request->validate([
            'email'    => 'required|string',
            'password' => 'required|string',
        ]);

        if ($data['email'] === 'admin@example.com' && $data['password'] === 'password') {
            return response()->json([
                'token' => 'dev-demo-token',
                'user'  => [
                    'id'    => 1,
                    'name'  => 'Admin User',
                    'email' => 'admin@example.com',
                    'role'  => 'Admin',
                ],
            ])->withHeaders([
                'Access-Control-Allow-Origin' => '*',
                'Access-Control-Allow-Headers' => '*',
                'Access-Control-Allow-Methods' => 'GET, POST, OPTIONS',
            ]);
        }

        return response()->json(['message' => 'Invalid credentials'], Response::HTTP_UNAUTHORIZED)
            ->withHeaders([
                'Access-Control-Allow-Origin' => '*',
                'Access-Control-Allow-Headers' => '*',
                'Access-Control-Allow-Methods' => 'GET, POST, OPTIONS',
            ]);
    }
}
