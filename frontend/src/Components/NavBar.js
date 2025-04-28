import React from 'react';
import { Link } from 'react-router-dom'; // ✅ Import Link
import { FaUserCircle } from 'react-icons/fa'; // Font Awesome User Icon
import logo from '../assets/logo.png';

function NavBar() {
  return (
    <div>
      <nav
        className="navbar navbar-expand-lg navbar-dark fixed-top"
        style={{ backgroundColor: "#1a1a1a", zIndex: "1030" }}
      >
        <div className="container-fluid">
          <Link
            className="navbar-brand text-light mr-auto d-flex align-items-center"
            to="/"
            style={{ fontWeight: "bold", fontSize: "24px" }}
          >
            <img 
              src={logo} 
              alt="Live Art Clothings Logo" 
              style={{ height: "40px", marginRight: "10px" }}
            />
            Live Art Clothings
          </Link>

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
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0" style={{ gap: "2rem" }}>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/productlist">Products</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/order-status">Orders</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/locations">Locations</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="">Users</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/add-feedback">Feedback</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/faq">FAQ</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/contact">Contact Us</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/aboutus">About us</Link>
              </li>
            </ul>

            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link text-white d-flex align-items-center" to="/login" style={{ marginRight: "20px" }}>
                  <FaUserCircle style={{ marginRight: '6px' }} />
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Padding to avoid content hiding under the navbar */}
      <div style={{ paddingTop: "70px" }}></div>
    </div>
  );
}

export default NavBar;
