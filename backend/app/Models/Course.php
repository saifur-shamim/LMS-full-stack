<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Course extends Model
{
    use HasFactory;
    protected $fillable = ['title', 'description', 'image', 'level_id', 'status', 'is_featured'];
    protected $appends = ['course_small_image'];


    function getCourseSmallImageAttribute()
    {
        if ($this->image == "") {
            return "";
        }
        return asset('uploads/course/small/' . $this->image);
    }

    public function chapters()
    {
        return $this->hasMany(Chapter::class)->orderBy('sort_order', 'ASC');
    }

    public function outcomes()
    {
        return $this->hasMany(Outcome::class)->orderBy('sort_order', 'ASC');
    }

    public function requirements()
    {
        return $this->hasMany(Requirement::class)->orderBy('sort_order', 'ASC');
    }
    public function level()
    {
        return $this->belongsTo(Level::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function language()
    {
        return $this->belongsTo(Language::class);
    }
}
