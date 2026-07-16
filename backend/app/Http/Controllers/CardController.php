<?php
namespace App\Http\Controllers;
use App\Models\Card;
use Illuminate\Http\Request;
class CardController extends Controller {
    public function index(Request $request) {
        $query = Card::query();
        if ($request->has('list_id')) { $query->where('list_id', $request->list_id); }
        return response()->json($query->orderBy('position')->get());
    }
    public function store(Request $request) {
        $validated = $request->validate([
            'list_id' => 'required|exists:card_lists,id',
            'member_id' => 'nullable|exists:members,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'position' => 'integer',
            'due_date' => 'nullable|date',
        ]);
        $card = Card::create($validated);
        return response()->json($card->fresh(), 201);
    }
    public function update(Request $request, Card $card) {
        $validated = $request->validate([
            'list_id' => 'exists:card_lists,id',
            'member_id' => 'nullable|exists:members,id',
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'position' => 'integer',
            'due_date' => 'nullable|date',
        ]);
        $card->update($validated);
        return response()->json($card->fresh());
    }
    public function destroy(Card $card) {
        $card->delete();
        return response()->json(null, 204);
    }
    public function move(Request $request, Card $card) {
        $validated = $request->validate([
            'list_id' => 'required|exists:card_lists,id',
            'position' => 'nullable|integer',
        ]);
        $card->list_id = $validated['list_id'];
        if (isset($validated['position'])) { $card->position = $validated['position']; }
        $card->save();
        return response()->json($card->fresh());
    }
}
