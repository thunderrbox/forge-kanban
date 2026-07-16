<?php
namespace App\Http\Controllers;
use App\Models\Member;
use Illuminate\Http\Request;
class MemberController extends Controller {
    public function index() { return response()->json(Member::all()); }
    public function store(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
        ]);
        $member = Member::create($validated);
        return response()->json($member, 201);
    }
    public function update(Request $request, Member $member) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
        ]);
        $member->update($validated);
        return response()->json($member);
    }
    public function destroy(Member $member) {
        $member->delete();
        return response()->json(null, 204);
    }
}
