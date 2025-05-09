<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::controller(AuthController::class)->group(function(){
    Route::post('register','register');
    Route::post('login','login');
    Route::get('usetdetail','userDetails');
    Route::post('logout','logout');
});

Route::controller(ProductController::class)->group(function(){
    Route::post('addproduct','addproduct');
    Route::get('get_products','get_products');
    Route::delete('delete_product','delete_product');
    Route::post('update_product','update_product');
   
});