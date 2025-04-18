<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login','register']]);
    }

    /* Login API */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(),
            [
                'email'=>'required|string|email',
                'password'=>'required|string'
            ]
        );

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $cridentials = $request->only('email', 'password');

        $token = Auth::attempt($cridentials);
        
        if(!$token){
            return response()->json([
                'status'=>'error',
                'message'=>'unauthorized'
            ], 401);
        }

        $user = Auth::user();
        return response()->json([
            'status'=> 'success',
            'user'=> $user,
            'authorisation'=> [
                'token' => $token,
                'type' => 'bearer'
            ]
        ]);
    }

    /* Register API */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(),
            [
                'name'=>'required|string|max:255',
                'email'=>'required|string|email|max:255|unique:users',
                'password'=>'required|string|min:6'
            ]
        );

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);

        // $token = $user->createToken('authToken')->plainTextToken;
        $token = JWTAuth::fromUser($user);

        return response()->json([
            'status' => 'success',
            'message'=>'User Registered Successfully',
            'user'=>$user,
            'authorisation'=> [
                'token' => $token,
                'type' => 'bearer'
            ]
        ]);

    }

    /*User Detail API */
    public function userDetails()
    {
        return response()->json(auth()->user());
    }

    public function logout(Request $request)
{
    try {
        JWTAuth::invalidate(JWTAuth::getToken()); // Invalidate the token
        return response()->json(['message' => 'Logged out successfully'], 200);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to log out'], 500);
    }
}
}
