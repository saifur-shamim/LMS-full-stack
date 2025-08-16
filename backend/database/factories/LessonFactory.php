<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Lesson;
use App\Models\Chapter;

class LessonFactory extends Factory
{
    protected $model = Lesson::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(4),
            'chapter_id' => Chapter::factory(), // link lesson to a chapter
            'video' => '', // leave empty or use fake path
            'sort_order' => 1, // optional, can use $this->faker->numberBetween(1,10)
        ];
    }
}
