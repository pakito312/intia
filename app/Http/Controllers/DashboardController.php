<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Assurance;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Statistiques
        $branch_id = auth()->user()->branche_id;

        $stats = [
            'total_clients' => Client::where('branche_id', $branch_id)->count(),
            'active_assurances' => Assurance::whereHas('client', function ($q) use ($branch_id) {
            $q->where('branche_id', $branch_id);
            })->where('status', 1)
              ->where('end_date', '>=', now())
              ->count(),
            'expired_assurances' => Assurance::whereHas('client', function ($q) use ($branch_id) {
            $q->where('branche_id', $branch_id);
            })->where('end_date', '<', now())
              ->count(),
            'clients_with_assurance' => Client::where('branche_id', $branch_id)
            ->whereHas('assurances')
            ->count(),
        ];

        // 5 derniers clients
        $recentClients = Client::where("branche_id",$branch_id)->with(['creator', 'branch'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($client) {
                return [
                    'id' => $client->id,
                    'name' => $client->name,
                    'email' => $client->email,
                    'phone' => $client->phone,
                    'created_at' => $client->created_at,
                    'branch' => $client->branch?->name,
                    'created_by' => $client->creator?->name,
                ];
            });

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentClients' => $recentClients,
        ]);
    }
}