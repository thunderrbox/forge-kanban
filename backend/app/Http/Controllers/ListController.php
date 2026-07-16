<?php
namespace App\Http\Controllers;
use App\Models\CardList;
use Illuminate\Http\Request;
class ListController extends Controller {
    public function index(Request $request) {
        $query = CardList::query();
        if ($request->has('board_id')) { $query->where('board_id', $request->board_id); }
        return response()->json($query->orderBy('position')->get());
    }
    public function store(Request $request) {
        $validated = $request->validate([
            'board_id' => 'required|exists:boards,id',
            'name' => 'required|string|max:255',
            'position' => 'integer',
        ]);
        $list = CardList::create($validated);
        return response()->json($list, 201);
    }
    public function update(Request $request, CardList $list) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'integer',
        ]);
        $list->update($validated);
        return response()->json($list);
    }
    public function destroy(CardList $list) {
        $list->delete();
        return response()->json(null, 204);
    }
}
