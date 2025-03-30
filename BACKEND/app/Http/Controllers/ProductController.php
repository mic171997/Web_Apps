<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
   
    public function addproduct(Request $request)

    {

        $request->validate([
            'itemcode' => 'required|string',
            'productname' => 'required|string',
            'rawPrice' => 'required|numeric',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if (!Storage::disk('public')->exists('products')) {
            Storage::disk('public')->makeDirectory('products');
        }

        $imagePath = $request->file('image')->store('products', 'public');

        $Exists = Product::where('itemcode' , $request->itemcode)->exists();

        if ($Exists == false) {
            Product::create([
                'itemcode' => $request->itemcode,
                'productname' => $request->productname,
                'price' => $request->rawPrice,
                'image_path' => $imagePath,
                
            ]);
    
            return response()->json([
                'status' => 'success',
                'message'=>'Added Successfully',
            ]);
        } else {
            return response()->json([
                'status' => 'exists',
                'message'=>'Product Already Exists',
            ]);
        }

    
    }

}
