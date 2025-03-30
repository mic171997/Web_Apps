import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";

const Layout = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("❌ No token found, redirecting to login...");
          navigate("/login");
          return;
        }

        console.log("🔄 Fetching user details...");
        const response = await axios.get("http://127.0.0.1:8000/api/usetdetail", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ User details fetched:", response.data);
        setUserDetails(response.data);
      } catch (error) {
        console.error("❌ Error fetching user details:", error);
        if (error.response?.status === 401) {
          Swal.fire({
            icon: "error",
            title: "Authentication Failed",
            text: "Please log in again.",
          }).then(() => navigate("/login"));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/logout", {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {userDetails ? (
        <Navbar style={{ height: "60px", fontSize: "14px", padding: "5px 10px", backgroundColor: "#171e20" }}>
          <Container>
            <Navbar.Toggle />
            <Navbar.Brand style={{ color: "#ffffff" }}>Welcome: {userDetails.name}</Navbar.Brand>
            <Navbar.Collapse className="justify-content-end">
              <Nav.Item>
                <NavLink to="/add" className="nav-link" style={{ color: "#ffffff", marginRight: "40px" }}>
                  Add Products
                </NavLink>
              </Nav.Item>
              <Nav.Item>
                <NavLink to="/dashboard" className="nav-link" style={{ color: "#ffffff", marginRight: "40px" }}>
                  Dashboard
                </NavLink>
              </Nav.Item>
              <Button variant="danger" size="sm" onClick={handleLogout}>Log Out</Button>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      ) : (
        <p style={{ textAlign: "center", color: "red" }}>⚠️ Navbar not loaded. User details missing.</p>
      )}

      <div style={{ padding: "20px" }}>
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
