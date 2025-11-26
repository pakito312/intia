<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ClientController extends Controller
{
    public function index()
    {
        $branch_id = auth()->user()->branche_id;
        $clients = Client::where('branche_id', $branch_id)->orderBy('id', 'desc')->paginate(15);
        return Inertia::render('Clients/Index', [
            'clients' => $clients,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:clients,email',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|string|max:20',
            'occupation' => 'nullable|string|max:255',
            'branche_id' => 'required|integer|exists:branches,id',
        ]);

        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();

        $client = Client::create($data);

        return redirect()->back()->with('success', 'Client créé.');
    }

    public function update(Request $request, Client $client)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:clients,email,' . $client->id,
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|string|max:20',
            'occupation' => 'nullable|string|max:255',
            'branche_id' => 'required|integer|exists:branches,id',
        ]);

        $data['updated_by'] = Auth::id();

        $client->update($data);

        return redirect()->back()->with('success', 'Client mis à jour.');
    }

    public function activate(Client $client)
    {
        $client->update(['status' => 1, 'updated_by' => Auth::id()]);
        return redirect()->back()->with('success', 'Client activé.');
    }

    public function deactivate(Client $client)
    {
        $client->update(['status' => 0, 'updated_by' => Auth::id()]);
        return redirect()->back()->with('success', 'Client désactivé.');
    }

    public function destroy(Client $client)
    {
        $client->delete();
        return redirect()->back()->with('success', 'Client supprimé.');
    }
}
