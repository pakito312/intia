<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Assurance;
use App\Models\Client;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AssuranceController extends Controller
{
    public function index()
    {
        $branch_id = auth()->user()->branche_id;

        $assurances = Assurance::when($branch_id, function ($query, $branch_id) {
            $query->whereHas('client', function ($q) use ($branch_id) {
                $q->where('branche_id', $branch_id);
            });
        })->with('client')->orderBy('id', 'desc')->paginate(15);
        $clients=Client::where('branche_id',$branch_id)->get();
        return Inertia::render('Assurances/Index', [
            'assurances' => $assurances,
            'clients' => $clients,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'client_id' => 'required|integer|exists:clients,id',
            'type' => 'required|string|max:255',
            'amount' => 'required|numeric',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();

        $assurance = Assurance::create($data);

        return redirect()->back()->with('success', 'Assurance créée.');
    }

    public function update(Request $request, Assurance $assurance)
    {
        $data = $request->validate([
            'client_id' => 'required|integer|exists:clients,id',
            'type' => 'required|string|max:255',
            'amount' => 'required|numeric',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $data['updated_by'] = Auth::id();

        $assurance->update($data);

        return redirect()->back()->with('success', 'Assurance mise à jour.');
    }

    public function activate(Assurance $assurance)
    {
        $assurance->update(['status' => 1, 'updated_by' => Auth::id()]);
        return redirect()->back()->with('success', 'Assurance activée.');
    }

    public function deactivate(Assurance $assurance)
    {
        $assurance->update(['status' => 0, 'updated_by' => Auth::id()]);
        return redirect()->back()->with('success', 'Assurance désactivée.');
    }

    public function destroy(Assurance $assurance)
    {
        $assurance->delete();
        return redirect()->back()->with('success', 'Assurance supprimée.');
    }
}
