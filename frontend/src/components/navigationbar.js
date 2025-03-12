import React, { useState, useEffect } from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const MainNavbar = () => {
  const location = useLocation();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/users/role`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!response.ok) {
          console.error("Gagal mendapatkan role:", response.status);
          return;
        }

        const data = await response.json();
        if (data.success) {
          setRole(data.role);
        }
      } catch (err) {
        console.error("Error saat fetch role:", err);
      }
    };

    if (location.pathname === "/dashboard") {
      fetchRole();
    }
  }, [location.pathname]);

  return (
    <Navbar expand="lg" style={{ backgroundColor: "#4e93dc" }}>
      <Container>
        <Navbar.Brand as={Link} to="/" style={{ color: "white" }}>
          Dinas Perhubungan Kota Batu
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            {location.pathname.startsWith("/detail/") && (
              <Nav.Link as={Link} to="/dashboard" style={{ color: "white" }}>
                Dashboard
              </Nav.Link>
            )}

            {location.pathname === "/manage-user" && (
              <NavDropdown
                title={<span style={{ color: "white" }}>Manage</span>}
                id="admin-nav-dropdown"
              >
                <NavDropdown.Item as={Link} to="/dashboard">
                  Dashboard
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/logout">
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}

            {location.pathname === "/dashboard" && role === 1 && (
              <NavDropdown
                title={<span style={{ color: "white" }}>Manage</span>}
                id="admin-nav-dropdown"
              >
                <NavDropdown.Item as={Link} to="/manage-user">
                  Manage User
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/logout">
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}

            {location.pathname === "/dashboard" && role === 2 && (
              <Nav.Link as={Link} to="/logout" style={{ color: "white" }}>
                Logout
              </Nav.Link>
            )}

            {["/", "/pelaporan", "/verifikasi", "/login"].includes(
              location.pathname
            ) && (
              <>
                <Nav.Link as={Link} to="/" style={{ color: "white" }}>
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/pelaporan" style={{ color: "white" }}>
                  Lapor
                </Nav.Link>
                <Nav.Link as={Link} to="/verifikasi" style={{ color: "white" }}>
                  Status
                </Nav.Link>
                <Nav.Link as={Link} to="/login" style={{ color: "white" }}>
                  Login
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MainNavbar;
