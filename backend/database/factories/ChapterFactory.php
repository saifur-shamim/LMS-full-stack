<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Chapter;
use App\Models\Course;

class ChapterFactory extends Factory
{
    protected $model = Chapter::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(3),
            'course_id' => Course::factory(), // link to a course
            'sort_order' => 1, // optional, or random
        ];
    }
}
