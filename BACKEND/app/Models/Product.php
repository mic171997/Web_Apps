<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $table = 'products'; // Optional if table name follows Laravel conventions

    protected $fillable = [
        'itemcode',
        'productname', // Fixed typo
        'price',
        'image_path'
    ];
}
