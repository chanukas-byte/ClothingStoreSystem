import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="text-white" style={{ backgroundColor: "#1a1a1a", paddingTop: "3rem" }}>
      <div className="container">
        <div className="row g-4">
          {/* About Section */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="text-uppercase mb-3 fw-bold" style={{ color: "#ff4081" }}>About Live Art</h5>
            <p className="text-muted" style={{ fontSize: "0.95rem", lineHeight: "1.7" }}>
              Live Art empowers creativity, uniting artists to transform visions into reality. 
              Our clothing line represents the fusion of art and fashion, creating unique pieces 
              that allow you to express yourself through style.
            </p>
            <div className="d-flex mt-3">
              <a href="#" className="me-3 text-white" style={{ fontSize: "1.5rem", transition: "all 0.3s ease" }}>
                <FaFacebook />
              </a>
              <a href="#" className="me-3 text-white" style={{ fontSize: "1.5rem", transition: "all 0.3s ease" }}>
                <FaTwitter />
              </a>
              <a href="#" className="me-3 text-white" style={{ fontSize: "1.5rem", transition: "all 0.3s ease" }}>
                <FaInstagram />
              </a>
              <a href="#" className="text-white" style={{ fontSize: "1.5rem", transition: "all 0.3s ease" }}>
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="text-uppercase mb-3 fw-bold" style={{ color: "#ff4081" }}>Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-muted text-decoration-none" style={{ transition: "all 0.3s ease" }}>
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/add-employee" className="text-muted text-decoration-none" style={{ transition: "all 0.3s ease" }}>
                  Join Us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/assign-salary" className="text-muted text-decoration-none" style={{ transition: "all 0.3s ease" }}>
                  Salary Management
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/add-report" className="text-muted text-decoration-none" style={{ transition: "all 0.3s ease" }}>
                  Report Analyze
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/productlist" className="text-muted text-decoration-none" style={{ transition: "all 0.3s ease" }}>
                  Shop
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="text-uppercase mb-3 fw-bold" style={{ color: "#ff4081" }}>Contact Us</h5>
            <ul className="list-unstyled">
              <li className="mb-3 d-flex align-items-center">
                <FaMapMarkerAlt className="me-2" style={{ color: "#ff4081" }} />
                <span className="text-muted">123 Fashion Street, Design District, Melbourne</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <FaPhone className="me-2" style={{ color: "#ff4081" }} />
                <span className="text-muted">+61 123 456 789</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <FaEnvelope className="me-2" style={{ color: "#ff4081" }} />
                <span className="text-muted">info@liveart.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="text-uppercase mb-3 fw-bold" style={{ color: "#ff4081" }}>Newsletter</h5>
            <p className="text-muted" style={{ fontSize: "0.95rem" }}>
              Stay updated with the latest collections and exclusive offers.
            </p>
            <div className="input-group mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Your email"
                aria-label="Subscriber's email"
                style={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.1)", 
                  border: "none",
                  color: "white",
                  borderRadius: "20px 0 0 20px"
                }}
              />
              <button 
                className="btn" 
                type="button"
                style={{ 
                  backgroundColor: "#ff4081", 
                  color: "white",
                  borderRadius: "0 20px 20px 0",
                  border: "none"
                }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <hr style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)", margin: "2rem 0" }} />

        {/* Copyright Section */}
        <div className="row py-3">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0 text-muted" style={{ fontSize: "0.9rem" }}>
              © 2025 Live Art Clothings | All Rights Reserved
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <p className="mb-0 text-muted" style={{ fontSize: "0.9rem" }}>
              Designed with <span style={{ color: "#ff4081" }}>♥</span> by Live Art Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
