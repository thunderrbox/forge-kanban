<?php
namespace App\Http\Controllers;
use App\Models\Tag;
use Illuminate\Http\Request;
class TagController extends Controller {
    public function index() { return response()->json(Tag::all()); }
    public function store(Request $request) {
        $validated = $request->validate([
            'card_id' => 'required|exists:cards,id',
            'name' => 'required|string|max:255',
            'color' => 'required|string|max:255',
        ]);
        $tag = Tag::create($validated);
        return response()->json($tag, 201);
    }
    public function update(Request $request, Tag $tag) {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'color' => 'string|max:255',
        ]);
        $tag->update($validated);
        return response()->json($tag);
    }
    public function destroy(Tag $tag) {
        $tag->delete();
        return response()->json(null, 204);
    }
}
