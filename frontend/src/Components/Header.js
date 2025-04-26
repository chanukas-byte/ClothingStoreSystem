import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; // For navigation between routes
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch, FaUser, FaShoppingCart } from "react-icons/fa";

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <div>
      {/* Navbar */}
      <nav
        className={`navbar navbar-expand-lg navbar-dark fixed-top ${
          scrolled ? "scrolled" : ""
        }`}
        style={{
          backgroundColor: scrolled ? "rgba(26, 26, 26, 0.95)" : "#1a1a1a",
          width: "100%",
          zIndex: "1030",
          transition: "all 0.3s ease",
          boxShadow: scrolled ? "0 2px 10px rgba(0, 0, 0, 0.1)" : "none",
        }}
      >
        <div className="container">
          {/* Brand Name */}
          <Link
            className="navbar-brand text-light"
            to="/"
            style={{ 
              fontWeight: "bold", 
              fontSize: "24px",
              display: "flex",
              alignItems: "center"
            }}
          >
            <span style={{ color: "#ff4081" }}>Live</span> Art Clothings
          </Link>

          {/* Hamburger menu for small screens */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link 
                  className={`nav-link text-white ${isActive("/")}`} 
                  to="/"
                  style={{
                    position: "relative",
                    padding: "0.5rem 1rem",
                    transition: "all 0.3s ease"
                  }}
                >
                  Home
                  {isActive("/") && (
                    <span 
                      style={{
                        position: "absolute",
                        bottom: "0",
                        left: "0",
                        width: "100%",
                        height: "2px",
                        backgroundColor: "#ff4081"
                      }}
                    ></span>
                  )}
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link text-white ${isActive("/add-employee")}`} 
                  to="/add-employee"
                  style={{
                    position: "relative",
                    padding: "0.5rem 1rem",
                    transition: "all 0.3s ease"
                  }}
                >
                  Join Us
                  {isActive("/add-employee") && (
                    <span 
                      style={{
                        position: "absolute",
                        bottom: "0",
                        left: "0",
                        width: "100%",
                        height: "2px",
                        backgroundColor: "#ff4081"
                      }}
                    ></span>
                  )}
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link text-white ${isActive("/view-salary")}`} 
                  to="/view-salary"
                  style={{
                    position: "relative",
                    padding: "0.5rem 1rem",
                    transition: "all 0.3s ease"
                  }}
                >
                  View Salaries
                  {isActive("/view-salary") && (
                    <span 
                      style={{
                        position: "absolute",
                        bottom: "0",
                        left: "0",
                        width: "100%",
                        height: "2px",
                        backgroundColor: "#ff4081"
                      }}
                    ></span>
                  )}
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link text-white ${isActive("/all-reports")}`} 
                  to="/all-reports"
                  style={{
                    position: "relative",
                    padding: "0.5rem 1rem",
                    transition: "all 0.3s ease"
                  }}
                >
                  View Reports
                  {isActive("/all-reports") && (
                    <span 
                      style={{
                        position: "absolute",
                        bottom: "0",
                        left: "0",
                        width: "100%",
                        height: "2px",
                        backgroundColor: "#ff4081"
                      }}
                    ></span>
                  )}
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link text-white ${isActive("/assign-salary")}`} 
                  to="/assign-salary"
                  style={{
                    position: "relative",
                    padding: "0.5rem 1rem",
                    transition: "all 0.3s ease"
                  }}
                >
                  Salary Management
                  {isActive("/assign-salary") && (
                    <span 
                      style={{
                        position: "absolute",
                        bottom: "0",
                        left: "0",
                        width: "100%",
                        height: "2px",
                        backgroundColor: "#ff4081"
                      }}
                    ></span>
                  )}
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link text-white ${isActive("/add-report")}`} 
                  to="/add-report"
                  style={{
                    position: "relative",
                    padding: "0.5rem 1rem",
                    transition: "all 0.3s ease"
                  }}
                >
                  Report Analyze
                  {isActive("/add-report") && (
                    <span 
                      style={{
                        position: "absolute",
                        bottom: "0",
                        left: "0",
                        width: "100%",
                        height: "2px",
                        backgroundColor: "#ff4081"
                      }}
                    ></span>
                  )}
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link text-white ${isActive("/inventory-management-Home")}`} 
                  to="/inventory-management-Home"
                  style={{
                    position: "relative",
                    padding: "0.5rem 1rem",
                    transition: "all 0.3s ease"
                  }}
                >
                  Inventory Management
                  {isActive("/inventory-management-Home") && (
                    <span 
                      style={{
                        position: "absolute",
                        bottom: "0",
                        left: "0",
                        width: "100%",
                        height: "2px",
                        backgroundColor: "#ff4081"
                      }}
                    ></span>
                  )}
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link text-white ${isActive("/all-employees")}`} 
                  to="/all-employees"
                  style={{
                    position: "relative",
                    padding: "0.5rem 1rem",
                    transition: "all 0.3s ease"
                  }}
                >
                  View All Employees
                  {isActive("/all-employees") && (
                    <span 
                      style={{
                        position: "absolute",
                        bottom: "0",
                        left: "0",
                        width: "100%",
                        height: "2px",
                        backgroundColor: "#ff4081"
                      }}
                    ></span>
                  )}
                </Link>
              </li>
            </ul>

            {/* Search Form and Icons */}
            <div className="d-flex align-items-center">
              <form className="d-flex me-3">
                <div className="input-group">
                  <input
                    className="form-control bg-dark text-white border-light"
                    type="search"
                    placeholder="Search..."
                    aria-label="Search"
                    style={{ 
                      borderRadius: "20px 0 0 20px",
                      border: "none",
                      padding: "0.5rem 1rem"
                    }}
                  />
                  <button 
                    className="btn btn-outline-light" 
                    type="submit"
                    style={{ 
                      borderRadius: "0 20px 20px 0",
                      border: "none",
                      backgroundColor: "#ff4081"
                    }}
                  >
                    <FaSearch />
                  </button>
                </div>
              </form>
              
              <div className="d-flex">
                <Link to="/login" className="me-3 text-white" style={{ fontSize: "1.2rem" }}>
                  <FaUser />
                </Link>
                <Link to="/cart" className="text-white position-relative" style={{ fontSize: "1.2rem" }}>
                  <FaShoppingCart />
                  <span 
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: "0.6rem" }}
                  >
                    0
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Adding padding to ensure content isn't hidden under the navbar */}
      <div style={{ paddingTop: "80px" }}>
      </div>
    </div>
  );
}

export default Header;
