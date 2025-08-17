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
        $categories = Category::orderBy("name", "asc")
            ->where('status', 1)
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $categories,
        ], 200);
    }

    public function fetchFeaturedCourses()
    {
        $courses = Course::orderBy("title", "asc")
            ->with('level')
            ->where('is_featured', 'yes')
            ->where('status', 1)
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $courses,
        ], 200);
    }

    public function courses(Request $request)
    {
        $courses = Course::where('status', 1);

        // Filter Course by keyword
        if (!empty($request->keyword)) {
            $courses = $courses->where('title', 'like', '%' . $request->keyword . '%');
        }

        // Filter Courses by
        if (!empty($request->category)) {
            $categoryArr = explode(',', $request->category);
            if (!empty($categoryArr)) {
                $courses = $courses->whereIn('category_id', $categoryArr);
            }
        }

        // Filter Courses by level
        if (!empty($request->level)) {
            $levelArr = explode(',', $request->level);
            if (!empty($levelArr)) {
                $courses = $courses->whereIn('level_id', $levelArr);
            }
        }

        // Filter Courses by language
        if (!empty($request->language)) {
            $languageArr = explode(',', $request->language);
            if (!empty($languageArr)) {
                $courses = $courses->whereIn('language_id', $languageArr);
            }
        }
        if (!empty($request->sort)) {
            $sortArr = ['asc', 'desc'];
            if (in_array($request->sort, $sortArr)) {
                $courses = $courses->orderBy('created_at', $request->sort);
            } else {
                $courses = $courses->orderBy('created_at', 'DESC');
            }
        }

        $courses = $courses->get();

        return response()->json([
            'status' => 200,
            'data' => $courses
        ], 200);
    }
}
