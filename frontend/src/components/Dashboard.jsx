import React from "react";
import { Container , Table , Form , Button , Pagination} from "react-bootstrap";
import  { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Dashboard = () => {

    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const perPage = 2; 
    
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchProducts(1, searchQuery);
        }, 350); 

        return () => clearTimeout(delayDebounceFn); 
    }, [searchQuery]); 

    const fetchProducts = async (page = 1, search = "") => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/get_products", {
                params: { page, perPage, search }
            });

            setProducts(response.data.data);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

      const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            fetchProducts(page); 
        }
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://127.0.0.1:8000/api/delete_product?id=${id}`);
                    
                    Swal.fire({
                        title: "Deleted!",
                        text: "The product has been deleted.",
                        icon: "success",
                        timer: 2000, 
                        showConfirmButton: false
                    });
    
                    fetchProducts(currentPage); 
                } catch (error) {
                    console.error("Error deleting product:", error);
    
                    Swal.fire({
                        title: "Error!",
                        text: "Failed to delete product.",
                        icon: "error"
                    });
                }
            }
        });
    };


  return (
         <Container className="d-flex justify-content-center align-items-start vh-100" style={{ marginTop: "20px" }}>
             <Form style={{ width: "1200px", padding: "20px", background: "#fff", borderRadius: "10px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>

             <Form.Control  className="d-flex justify-content-center"  
    type="text" 
    style={{ width: "250px" , marginBottom: "10px"  }}
    placeholder="Search products..." 
    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
/>
             <Table striped bordered hover>
          <thead>
            <tr>
              <th>Item #</th>
              <th>Image</th>
              <th>Item Code</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product, index) => (
                <tr key={product.id}>
                  <td>{index + 1}</td>
                  <td><img src={`http://127.0.0.1:8000/storage/${product.image_path}`} alt="Product" width="100" height="70" /></td>
                  <td>{product.itemcode}</td>
                  <td>{product.productname}</td>
                  <td>${parseFloat(product.price).toFixed(2)}</td>
                  <td style={{textAlign: "center"}}><Button variant="info" size="xs" >Update</Button> <Button 
                        variant="danger" 
                        size="sm" 
                        onClick={() => handleDelete(product.id)}
                    >
                        Delete
                    </Button></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <Pagination className="justify-content-end">
          <Pagination.Prev 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1} 
          />
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item 
              key={index + 1} 
              active={index + 1 === currentPage} 
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages} 
          />
        </Pagination>
    </Form>
         </Container>
  );
};

export default Dashboard;
