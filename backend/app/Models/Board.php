<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Board extends Model {
    protected $fillable = ['name'];
    public function lists() {
        return $this->hasMany(CardList::class)->orderBy('position');
    }
}
