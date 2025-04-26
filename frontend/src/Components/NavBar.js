import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import logo from '../assets/logo.png';
import './NavBar.css';

function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <div>
      <nav className={`navbar navbar-expand-lg navbar-dark fixed-top ${scrolled ? 'scrolled' : ''}`}>
        <div className="container-fluid">
          <Link className="navbar-brand animate-fade-in" to="/">
            <img src={logo} alt="Live Art Clothings Logo" />
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
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item animate-slide-top" style={{ animationDelay: '0.1s' }}>
                <Link className="nav-link" to="/productlist">Products</Link>
              </li>
              <li className="nav-item animate-slide-top" style={{ animationDelay: '0.2s' }}>
                <Link className="nav-link" to="/order-status">Orders</Link>
              </li>
              <li className="nav-item animate-slide-top" style={{ animationDelay: '0.3s' }}>
                <Link className="nav-link" to="/locations">Locations</Link>
              </li>
              <li className="nav-item animate-slide-top" style={{ animationDelay: '0.4s' }}>
                <Link className="nav-link" to="">Users</Link>
              </li>
              <li className="nav-item animate-slide-top" style={{ animationDelay: '0.5s' }}>
                <Link className="nav-link" to="">Feedback</Link>
              </li>
              <li className="nav-item animate-slide-top" style={{ animationDelay: '0.6s' }}>
                <Link className="nav-link" to="/contact">Contact Us</Link>
              </li>
              <li className="nav-item animate-slide-top" style={{ animationDelay: '0.7s' }}>
                <Link className="nav-link" to="/aboutus">About us</Link>
              </li>
            </ul>

            <ul className="navbar-nav ml-auto">
              <li className="nav-item animate-slide-top" style={{ animationDelay: '0.8s' }}>
                <Link className="nav-link login-link" to="/login">
                  <FaUserCircle />
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div style={{ paddingTop: "70px" }}></div>
    </div>
  );
}

export default NavBar;
