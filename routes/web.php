<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\BrancheController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AssuranceController;
use App\Http\Controllers\DashboardController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Resource routes for branches, clients and assurances
    Route::resource('branches', BrancheController::class)->except(['create','edit','show']);
    Route::post('branches/{branche}/activate', [BrancheController::class, 'activate'])->name('branches.activate');
    Route::post('branches/{branche}/deactivate', [BrancheController::class, 'deactivate'])->name('branches.deactivate');

    Route::resource('clients', ClientController::class)->except(['create','edit','show']);
    Route::post('clients/{client}/activate', [ClientController::class, 'activate'])->name('clients.activate');
    Route::post('clients/{client}/deactivate', [ClientController::class, 'deactivate'])->name('clients.deactivate');

    Route::resource('assurances', AssuranceController::class)->except(['create','edit','show']);
    Route::post('assurances/{assurance}/activate', [AssuranceController::class, 'activate'])->name('assurances.activate');
    Route::post('assurances/{assurance}/deactivate', [AssuranceController::class, 'deactivate'])->name('assurances.deactivate');
});

require __DIR__.'/auth.php';
