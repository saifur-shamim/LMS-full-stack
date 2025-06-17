<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use App\Models\Language;
use App\Models\Level;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class CourseController extends Controller
{
    public function index() {}

    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'title' => 'required|min:5',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
            ], 400);
        }

        $course          = new Course();
        $course->title   = $request->title;
        $course->status  = 0;
        $course->user_id = $request->user()->id;
        $course->save();

        return response()->json([
            'status'  => 200,
            'data'    => $course,
            'message' => 'Course has been created successfully.',
        ], 200);
    }

    // This method will return categories/levels/languages
    public function metaData()
    {
        $categories = Category::all();
        $levels     = Level::all();
        $languages  = Language::all();

        return response()->json([
            'status'     => 200,
            'categories' => $categories,
            'levels'     => $levels,
            'languages'  => $languages,
        ], 200);
    }

    public function show($id)
    {
        $course = Course::find($id);

        if ($course == null) {
            return response()->json([
                'status'  => 404,
                'message' => 'Course not found',
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data'   => $course,
        ], 200);
    }

    public function update($id, Request $request)
    {
        $course = Course::find($id);

        if ($course == null) {
            return response()->json([
                'status'  => 404,
                'message' => 'Course not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|min:5',
            'category' => 'required',
            'level' => 'required',
            'language' => 'required',
            'sell_price' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
            ], 400);
        }


        $course->title   = $request->title;
        $course->category_id   = $request->category;
        $course->level_id   = $request->level;
        $course->language_id   = $request->language;
        $course->price  = $request->sell_price;
        $course->cross_price  = $request->cross_price;
        $course->description  = $request->description;
        $course->save();

        return response()->json([
            'status'  => 200,
            'data'    => $course,
            'message' => 'Course updated successfully.',
        ], 200);
    }

    public function saveCourseImage($id, Request $request)
    {
        $course = Course::find($id);
        if ($course == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'image' => 'required|mimes:png,jpg,jpeg'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        if ($course->image != null) {

            if (File::exists(public_path('uploads/course/' . $course->image))) {
                File::delete(public_path('uploads/course/' . $course->image));
            }

            if (File::exists(public_path('uploads/course/small/' . $course->image))) {
                File::delete(public_path('uploads/course/small/' . $course->image));
            }
        }

        $image = $request->image;
        $ext = $image->getClientOriginalExtension();
        $imageName = strtotime('now') . '--' . $id . '--' . $ext;
        $image->move(public_path('uploads/course'), $imageName);

        // create small thumbnail
        $manager = new ImageManager(Driver::class);
        $img = $manager->read(public_path('uploads/course/' . $imageName)); // 800 x 600

        // crop the best fitting 5:3 (600X360) ratio
        $img->cover(750, 450);
        $img->save(public_path('uploads/course/small' . $imageName));

        $course->image = $imageName;
        $course->save();

        return response()->json([
            'status' => 200,
            'data' => $course,
            'message' => 'Image uploaded successfully'
        ], 200);
    }
}
