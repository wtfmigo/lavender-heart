<?php

use App\Http\Controllers\PublicExperienceController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json(['status' => 'ok']));
Route::get('/experience', [PublicExperienceController::class, 'show']);
Route::get('/media/{id}', [PublicExperienceController::class, 'media'])->whereUlid('id');
