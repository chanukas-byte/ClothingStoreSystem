import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from 'react-router-dom';
import Footer from "./Footer";
import './HomeLiveArt.css';

// Import the single image
import kImage from '../assets/k.png';
// Import the logo
import logoImage from '../assets/logo.png';

const HomeLiveArt = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [trails, setTrails] = useState([]);
  const heroRef = useRef(null);
  
  const handleShopNow = () => {
    navigate('/productlist'); // Navigate to the product list page
  };

  // Handle mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const { left, top, width, height } = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        
        // Update mouse position for trails
        setMousePosition({ x: e.clientX, y: e.clientY });
        
        // Apply subtle parallax effect to hero image
        const heroImage = heroRef.current.querySelector('.hero-image');
        if (heroImage) {
          const moveX = (x - 0.5) * 20;
          const moveY = (y - 0.5) * 20;
          heroImage.style.transform = `translateZ(-10px) scale(1.1) translate(${moveX}px, ${moveY}px)`;
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Create mouse trail effect
  useEffect(() => {
    const createTrail = () => {
      if (trails.length > 0) {
        setTrails(prevTrails => {
          const newTrails = [...prevTrails];
          newTrails.shift(); // Remove oldest trail
          return newTrails;
        });
      }
      
      setTrails(prevTrails => [
        ...prevTrails,
        { x: mousePosition.x, y: mousePosition.y, id: Date.now() }
      ]);
    };

    const trailInterval = setInterval(createTrail, 50);
    return () => clearInterval(trailInterval);
  }, [mousePosition, trails]);

  return (
    <div className="home-live-art">
      <div className="hero-container" ref={heroRef}>
        <div className="hero-image-container">
          <img 
            src={kImage} 
            alt="Live Art Fashion" 
            className="hero-image"
          />
          
          {/* Floating elements */}
          <div className="floating-elements">
            <div className="floating-element"></div>
            <div className="floating-element"></div>
            <div className="floating-element"></div>
          </div>
          
          <div className="hero-overlay">
            <div className="login-icon-container">
              <Link to="/login" className="login-icon-link">
                <div className="login-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              </Link>
            </div>
            
            <div className="brand-logo-container">
              <img src={logoImage} alt="Live Art Logo" className="brand-logo" />
            </div>
            <h1 className="brand-name reveal-text">LIVE ART</h1>
            <p className="brand-slogan">Express Yourself Through Fashion</p>
            <button className="shop-now-btn" onClick={handleShopNow}>
              Shop Now
            </button>
            
            {/* Scroll indicator */}
            <div className="scroll-indicator">
              <span className="scroll-text">Scroll</span>
              <div className="scroll-arrow"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mouse trail elements */}
      {trails.map(trail => (
        <div 
          key={trail.id}
          className="mouse-trail"
          style={{
            left: `${trail.x}px`,
            top: `${trail.y}px`,
            opacity: 0.5 - (trails.indexOf(trail) * 0.1)
          }}
        ></div>
      ))}
      
      <Footer />
    </div>
  );
};

export default HomeLiveArt;
