<?php
namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;

class LessonController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'chapter' => 'required',
            'lesson'  => 'required',
            'status'  => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
            ], 400);
        }

        $lesson             = new Lesson();
        $lesson->chapter_id = $request->chapter;
        $lesson->title      = $request->lesson;
        $lesson->sort_order = 1000;
        $lesson->status     = $request->status;
        $lesson->save();

        return response()->json([
            'status'  => 200,
            'data'    => $lesson,
            'message' => 'Lesson added successfully.',
        ], 200);
    }

    public function show($id)
    {

        $lesson = Lesson::find($id);

        if ($lesson == null) {
            return response()->json([
                'status'  => 404,
                'message' => 'Lesson not found.',
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data'   => $lesson,
        ], 200);
    }

    public function update($id, Request $request)
    {
        // need to modify according to store method (chapter_id to chapter)
        $lesson = Lesson::find($id);

        if ($lesson === null) {
            return response()->json([
                'status'  => 404,
                'message' => 'Lesson not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'chapter_id' => 'required',
            'lesson'     => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
            ], 400);
        }

        $lesson->chapter_id      = $request->chapter_id;
        $lesson->title           = $request->lesson;
        $lesson->is_free_preview = ($request->is_free_preview == false) ? 'no' : 'yes';
        $lesson->duration        = $request->duration;
        $lesson->description     = $request->description;
        $lesson->status          = $request->status;
        $lesson->save();

        return response()->json([
            'status'  => 200,
            'data'    => $lesson,
            'message' => 'Lesson Updated successfully.',
        ], 200);
    }

    public function destroy($id)
    {
        $lesson = Lesson::find($id);

        if ($lesson == null) {
            return response()->json([
                'status'  => 404,
                'message' => 'Lesson not found',
            ], 404);
        }

        $chapterId = $lesson->chapter_id;

        $lesson->delete();

        $chapter = Chapter::where('id', $chapterId)->with('lessons')->first();

        return response()->json([
            'status'  => 200,
            'chapter' => $chapter,
            'message' => 'Lesson deleted successfully.',
        ], 200);
    }

    public function saveVideo($id, Request $request)
    {
        $lesson = Lesson::find($id);
        if ($lesson == null) {
            return response()->json([
                'status'  => 404,
                'message' => 'Lesson not found.',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'video' => 'required|mimes:mp4',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
            ], 400);
        }

        if ($lesson->video != "") {

            if (File::exists(public_path('uploads/course/videos/' . $lesson->video))) {
                File::delete(public_path('uploads/course/videos' . $lesson->video));
            }
        }

        $video     = $request->video;
        $ext       = $video->getClientOriginalExtension();
        $videoName = strtotime('now') . '--' . $id . '--' . $ext;
        $video->move(public_path('uploads/course/videos'), $videoName);

        $lesson->video = $videoName;
        $lesson->save();

        return response()->json([
            'status'  => 200,
            'data'    => $lesson,
            'message' => 'Video uploaded successfully',
        ], 200);
    }
}
