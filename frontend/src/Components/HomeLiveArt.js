import React, { useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import Footer from "./Footer";
import Header from "./Header";
import './HomeLiveArt.css';

// Import the single image
import kImage from '../assets/k.png';
// Import the logo
import logoImage from '../assets/logo.png';
import { FaArrowRight, FaShoppingBag, FaUser, FaHeart } from "react-icons/fa";

const HomeLiveArt = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Add animation class to elements after component mounts
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, 200 * index);
    });
  }, []);
  
  const handleShopNow = () => {
    navigate('/productlist'); // Navigate to the product list page
  };

  return (
    <div className="home-live-art">
      <Header />
      
      {/* Hero Section */}
      <div className="hero-container">
        <div className="hero-image-container">
          <img 
            src={kImage} 
            alt="Live Art Fashion" 
            className="hero-image"
          />
          <div className="hero-overlay">
            <div className="login-icon-container">
              <Link to="/login" className="login-icon-link">
                <div className="login-icon">
                  <FaUser />
                </div>
              </Link>
            </div>
            
            <div className="brand-logo-container animate-on-scroll">
              <img src={logoImage} alt="Live Art Logo" className="brand-logo" />
            </div>
            <h1 className="brand-name animate-on-scroll">LIVE ART</h1>
            <p className="brand-slogan animate-on-scroll">Express Yourself Through Fashion</p>
            <button className="shop-now-btn animate-on-scroll" onClick={handleShopNow}>
              Shop Now <FaArrowRight className="ms-2" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Featured Categories Section */}
      <section className="featured-categories">
        <div className="container">
          <h2 className="section-title text-center mb-5 animate-on-scroll">Featured Categories</h2>
          <div className="row g-4">
            <div className="col-md-4 animate-on-scroll">
              <div className="category-card">
                <div className="category-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60')" }}>
                  <div className="category-overlay">
                    <h3>Men's Collection</h3>
                    <Link to="/productlist?category=men" className="category-link">
                      Explore <FaArrowRight className="ms-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 animate-on-scroll">
              <div className="category-card">
                <div className="category-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60')" }}>
                  <div className="category-overlay">
                    <h3>Women's Collection</h3>
                    <Link to="/productlist?category=women" className="category-link">
                      Explore <FaArrowRight className="ms-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 animate-on-scroll">
              <div className="category-card">
                <div className="category-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60')" }}>
                  <div className="category-overlay">
                    <h3>Accessories</h3>
                    <Link to="/productlist?category=accessories" className="category-link">
                      Explore <FaArrowRight className="ms-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us Section */}
      <section className="why-choose-us">
        <div className="container">
          <h2 className="section-title text-center mb-5 animate-on-scroll">Why Choose Live Art</h2>
          <div className="row g-4">
            <div className="col-md-3 animate-on-scroll">
              <div className="feature-card">
                <div className="feature-icon">
                  <FaShoppingBag />
                </div>
                <h3>Quality Products</h3>
                <p>Premium materials and craftsmanship for lasting quality.</p>
              </div>
            </div>
            <div className="col-md-3 animate-on-scroll">
              <div className="feature-card">
                <div className="feature-icon">
                  <FaHeart />
                </div>
                <h3>Unique Designs</h3>
                <p>Artistic creations that stand out from the crowd.</p>
              </div>
            </div>
            <div className="col-md-3 animate-on-scroll">
              <div className="feature-card">
                <div className="feature-icon">
                  <FaUser />
                </div>
                <h3>Customer Service</h3>
                <p>Dedicated support to enhance your shopping experience.</p>
              </div>
            </div>
            <div className="col-md-3 animate-on-scroll">
              <div className="feature-card">
                <div className="feature-icon">
                  <FaArrowRight />
                </div>
                <h3>Fast Delivery</h3>
                <p>Quick and reliable shipping to your doorstep.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default HomeLiveArt;
