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

    public function get_products(Request $request) {
        $perPage = (int) $request->input('perPage', 10);
        $search = $request->input('search');

        $products = Product::when(!empty($search), function ($query) use ($search) {
            $query->where('productname', 'like', "%{$search}%")
                  ->orWhere('itemcode', 'like', "%{$search}%");})->paginate($perPage);
       

        return response()->json([
            'data' => $products->items(),
            'currentPage' => $products->currentPage(),
            'totalPages' => $products->lastPage(),
        ]);
    }

    public function delete_product(Request $request) {

        $id= $request->id;

        $product = Product::find($id);
        
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }
    
        // Delete image file if exists
        if ($product->image_path && Storage::exists("public/{$product->image_path}")) {
            Storage::delete("public/{$product->image_path}");
        }
    
        $product->delete();
    
        return response()->json(['message' => 'Product deleted successfully']);
    }

    public function update_product(Request $request) {

        $id = $request->id;

        $product = Product::find($id);
        if (!$product) {
            return response()->json(['status' => 'error', 'message' => 'Product not found.'], 404);
        }

        $request->validate([
            'itemcode' => 'required|string',
            'productname' => 'required|string',
            'rawPrice' => 'required|numeric',
        ]);

    
            if ($request->hasFile('image')) {
                if ($product->image_path) {
                    Storage::disk('public')->delete($product->image_path);
                }
                $imagePath = $request->file('image')->store('products', 'public');
                $product->image_path = $imagePath;
            }
    
            $product->where('id' ,  $id)
            ->update([
                'itemcode' => $request->itemcode,
                'productname' => $request->productname,
                'price' => $request->rawPrice,
                'image_path' => $request->hasFile('image') ? $imagePath : $product->image_path,
            ]);
    
            return response()->json(['status' => 'success', 'message' => 'Product updated successfully!', 'product' => $product]);
        

       

    }

}
