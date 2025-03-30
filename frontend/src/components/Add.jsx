import { Container, Form ,Button, Image } from "react-bootstrap";
import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";

function TextControlsExample() {

  const location = useLocation();
  const productData = location.state?.product || null;
  
  const [itemcode, setItemcode] = useState(productData ? productData.itemcode : "");
  const [productname, setProductname] = useState(productData ? productData.productname : "");
  const [price, setPrice] = useState(productData ? productData.price : "");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(productData ? `http://127.0.0.1:8000/storage/${productData.image_path}` : null);
  const [rawPrice, setRawPrice] = useState(productData ? productData.price : "");
  const [selectedProduct, setselectedProduct] = useState(productData ? productData.id : "");


    

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    
    const formData = new FormData();
    formData.append("image", image);
    formData.append("itemcode", itemcode);
    formData.append("productname", productname);
    formData.append("rawPrice", rawPrice);

    Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: productData ? "Yes Update it" : "Yes Add Product"
            }).then(async (result) => {
                if (result.isConfirmed) {
 
     try{
                      const url = productData
                      ? `http://127.0.0.1:8000/api/update_product?id=${productData.id}`
                      : "http://127.0.0.1:8000/api/addproduct";

                  const response = await fetch(url, {
                      method: "POST",
                      headers: { "Accept": "application/json" },
                      body: formData,
                  });

                  const responseData = await response.json();
                if (responseData.status === "success") {
                    Swal.fire({
                      icon: responseData.status === "success" ? "success" : "error",
                      title: responseData.status === "success" ? "Success" : "Error",
                      text: responseData.message || (productData ? "Update failed." : "Adding failed."),
                    })
                    setItemcode("");
                    setProductname("");
                    setPrice("");
                    setRawPrice("");
                    setImage(null);
                    setPreview(null);
                }
                
                else if (responseData.status === "exists") {
                    Swal.fire({
                        icon: "warning",
                        title: "Warning",
                        text: responseData.message,
                    })
                }else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: responseData.message || "Adding failed.",
                    });
                }
            } catch (error) {
    
                console.log(error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "An error occurred during adding.",
                });
            }
          
        }
      });
  };

  
  const formatCurrency = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(parseFloat(value));
  };

  const handleChange = (e) => {
    let value = e.target.value.replace(/[^0-9.]/g, ""); // Keep only numbers and decimal points
    if (value.split(".").length > 2) return; // Prevent multiple decimals

    setRawPrice(value);
  };
  return (
    <Container className="d-flex justify-content-center align-items-start vh-100" style={{ marginTop: "20px" }}>
    <Form style={{ width: "800px", padding: "20px", background: "#fff", borderRadius: "10px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Item Code</Form.Label>
        <Form.Control type="text" placeholder="Item Code" value={itemcode} onChange={(e) => setItemcode(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Product Name</Form.Label>
        <Form.Control type="text" placeholder="product name" value={productname} onChange={(e) => setProductname(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Price</Form.Label>
        <Form.Control type="number" placeholder="price"  value={rawPrice} // Keep raw number input
        onChange={handleChange} />
         <div style={{ marginTop: "5px", fontWeight: "bold" }}>
        Formatted: {formatCurrency(rawPrice)}
      </div>
      </Form.Group>

      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Group className="mb-3">   
          <Form.Label>Select Image</Form.Label>
          <Form.Control id="fileInput" type="file" accept="image/*" onChange={handleFileChange} />
        </Form.Group>
      </Form.Group>

      {preview && (
          <div className="text-center mb-3">
            <Image src={preview} rounded style={{ width: "100%", maxHeight: "200px" }} />
          </div>
        )}

        <Button variant={selectedProduct ? "primary" : "success"} onClick={handleUpload} className="w-100">
        {selectedProduct ? "Update Product" : "Add Product"}
        </Button>
 
     
    </Form>
  </Container>
  );
}

export default TextControlsExample;