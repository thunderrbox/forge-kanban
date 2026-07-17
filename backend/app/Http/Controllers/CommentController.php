<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Comment;

class CommentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'card_id' => 'required|exists:cards,id',
            'content' => 'required|string|max:5000',
        ]);

        $comment = Comment::create($validated);
        return response()->json($comment, 201);
    }

    public function destroy($id)
    {
        $comment = Comment::findOrFail($id);
        $comment->delete();
        return response()->json(null, 204);
    }
}
