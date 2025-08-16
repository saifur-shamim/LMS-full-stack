<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Course;
use App\Models\Level;
use App\Models\User;

class CourseFactory extends Factory
{
    protected $model = Course::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(),
            'description' => $this->faker->paragraph(),
            'image' => '',
            'level_id' => Level::factory(),
            'user_id' => User::factory(), // <-- assign a user
            'status' => 1,
            'is_featured' => 'no',
        ];
    }
}
