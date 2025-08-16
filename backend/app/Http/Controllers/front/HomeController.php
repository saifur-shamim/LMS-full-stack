<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use Illuminate\Http\Request;

class HomeController extends Controller
{

    public function fetchCategories()   
    {
        $categories = Category::orderBy("name","asc")->get();

        return response()->json([
            'status'=>200,
            'data'=> $categories,
        ],200);
    }

    public function fetchFeaturedCourses()   
    {
        $courses = Course::orderBy("title","asc")
        ->where('is_featured', 'yes')
        ->where('status',1)
        ->get();

        return response()->json([
            'status'=>200,
            'data'=> $courses,
        ],200);
    }
}
