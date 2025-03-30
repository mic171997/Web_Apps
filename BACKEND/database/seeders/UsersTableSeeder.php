<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UsersTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('users')->insert([
            [
                'name' => 'John Doe',
                'email' => 'johndoe@example.com',
                'password' => bcrypt('password123'),
            ],
            [
                'name' => 'John Doe',
                'email' => 'johndoe1@example.com',
                'password' => bcrypt('password123'),
            ],
            [
                'name' => 'John Doe',
                'email' => 'johndoe2@example.com',
                'password' => bcrypt('password123'),
            ],
        ]);
    }
}