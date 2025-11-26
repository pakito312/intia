<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Branche;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class BrancheController extends Controller
{
    public function index()
    {
        $branches = Branche::orderBy('id', 'desc')->paginate(15);
        return Inertia::render('Branches/Index', [
            'branches' => $branches,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:branches,name',
            'location' => 'required|string|max:255',
        ]);

        $branch = Branche::create($data + ['status' => 1]);

        return redirect()->back()->with('success', 'Branche créée.');
    }

    public function update(Request $request, Branche $branche)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:branches,name,' . $branche->id,
            'location' => 'required|string|max:255',
        ]);

        $branche->update($data);

        return redirect()->back()->with('success', 'Branche mise à jour.');
    }

    public function activate(Branche $branche)
    {
        $branche->update(['status' => 1]);
        return redirect()->back()->with('success', 'Branche activée.');
    }

    public function deactivate(Branche $branche)
    {
        $branche->update(['status' => 0]);
        return redirect()->back()->with('success', 'Branche désactivée.');
    }

    public function destroy(Branche $branche)
    {
        $branche->delete();
        return redirect()->back()->with('success', 'Branche supprimée.');
    }
}
