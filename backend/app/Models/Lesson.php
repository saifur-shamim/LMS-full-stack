<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Lesson extends Model
{
    use HasFactory;
    protected $appends = ['video_url'];

    function getVideoUrlAttribute()
    {
        if ($this->video == "") {
            return "";
        }
        return asset('uploads/course/videos/' . $this->video);
    }
}
