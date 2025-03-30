<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Faker\Factory as Faker;

class ProductsTableSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        if (!Storage::disk('public')->exists('products')) {
            Storage::disk('public')->makeDirectory('products');
        }

        foreach (range(1, 50) as $index) {
          
            $imageName = strtolower($faker->word . '_' . $faker->word . '_' . $faker->word . '.png'); 

            $imageUrl = 'https://vastlife.com/cdn/shop/files/Jyrays652499208b6af9652499208b7e2.39517501652499208b7e2.jpg?v=1697491484&width=1800';

            $imageContent = file_get_contents($imageUrl);

            if ($imageContent) {
               
                Storage::disk('public')->put('products/' . $imageName, $imageContent);

            DB::table('products')->insert([
                'itemcode' => $faker->randomNumber(8, true),
                'productname' => $faker->word, 
                'price' => $faker->randomFloat(2, 10, 100), 
                'image_path' => 'products/' . $imageName, 
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
    }
}
