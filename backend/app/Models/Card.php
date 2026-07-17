<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Card extends Model {
    protected $fillable = ['list_id', 'member_id', 'title', 'description', 'position', 'due_date'];
    protected $with = ['tags', 'member', 'comments'];
    public function list() {
        return $this->belongsTo(CardList::class, 'list_id');
    }
    public function member() {
        return $this->belongsTo(Member::class);
    }
    public function tags() {
        return $this->hasMany(Tag::class);
    }
    public function comments() {
        return $this->hasMany(Comment::class)->orderBy('created_at', 'desc');
    }
}
