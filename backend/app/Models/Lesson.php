<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    protected $appends = ['video_url'];

    function getVideoUrlAttribute()
    {
        if ($this->video == "") {
            return "";
        }
        return asset('uploads/course/videos/' . $this->video);
    }
}
