<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use App\Models\Language;
use App\Models\Level;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class HomeController extends Controller
{

    public function fetchCategories()
    {
        $categories = Category::orderBy("name", "asc")
            ->where('status', 1)
            ->get();

        return response()->json([
            'status' => ResponseAlias::HTTP_OK,
            'data' => $categories,
        ], ResponseAlias::HTTP_OK);
    }

    public function fetchLevels()
    {
        $levels = Level::orderBy("created_at", "asc")
            ->where('status', 1)
            ->get();

        return response()->json([
            'status' => ResponseAlias::HTTP_OK,
            'data' => $levels,
        ], ResponseAlias::HTTP_OK);
    }

    public function fetchLanguages()
    {
        $languages = Language::orderBy("name", "asc")
            ->where('status', 1)
            ->get();

        return response()->json([
            'status' => ResponseAlias::HTTP_OK,
            'data' => $languages,
        ], ResponseAlias::HTTP_OK);
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
        $courses = Course::where('status', 1)->with('level');

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
        // Change sortBy to sortby to match your React fetch request
        if (!empty($request->sortby)) {
            $sortArr = ['asc', 'desc'];
            if (in_array($request->sortby, $sortArr)) {
                $courses = $courses->orderBy('created_at', $request->sortby);
            } else {
                $courses = $courses->orderBy('created_at', 'desc');
            }
        } else {
            // Default sorting if no parameter is provided
            $courses = $courses->orderBy('created_at', 'desc');
        }

        $courses = $courses->get();

        return response()->json([
            'status' => 200,
            'data' => $courses
        ], 200);
    }
}
