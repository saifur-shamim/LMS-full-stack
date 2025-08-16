<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Chapter extends Model
{


    use HasFactory;
    public function lessons()
    {
        return $this->hasMany(Lesson::class)->orderBy('sort_order', 'ASC');
    }
}
