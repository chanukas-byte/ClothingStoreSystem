import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import Footer from "./Footer";
import './HomeLiveArt.css';

// Import the single image
import kImage from '../assets/k.png';
// Import the logo
import logoImage from '../assets/logo.png';

const HomeLiveArt = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [loginType, setLoginType] = useState('user');
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  
  const handleShopNow = () => {
    navigate('/productlist'); // Navigate to the product list page
  };

  const handleLoginIconClick = () => {
    setShowLogin(true);
    setLoginType('user');
    setUsername("");
    setPassword("");
    setLoginError("");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginType === 'user') {
      if (username === 'live123' && password === 'live 123') {
        setShowLogin(false);
        setUsername("");
        setPassword("");
        setLoginError("");
        navigate('/productlist');
      } else {
        setLoginError('Invalid user credentials.');
      }
    } else if (loginType === 'admin') {
      if (username === 'admin123' && password === 'admin123') {
        setShowLogin(false);
        setUsername("");
        setPassword("");
        setLoginError("");
        navigate('/Home');
      } else {
        setLoginError('Invalid admin credentials.');
      }
    }
  };

  return (
    <div className="home-live-art">
      <div className="hero-container">
        <div className="hero-image-container">
          <img 
            src={kImage} 
            alt="Live Art Fashion" 
            className="hero-image"
          />
          <div className="hero-overlay">
            <div className="login-icon-container">
              <div className="login-icon-link" onClick={handleLoginIconClick} style={{cursor: 'pointer'}}>
                <div className="login-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              </div>
            </div>
            {/* Login Popup */}
            {showLogin && (
              <div className="admin-login-modal-overlay">
                <div className="admin-login-modal">
                  <h2 className="admin-login-title">{loginType === 'user' ? 'User Login' : 'Admin Login'}</h2>
                  <div className="admin-login-switcher" style={{marginBottom: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center'}}>
                    <button className={`admin-login-btn${loginType === 'user' ? ' active' : ''}`} style={{padding: '0.5rem 1.5rem', background: loginType === 'user' ? '#333' : '#bbb', color: loginType === 'user' ? '#fff' : '#222'}} onClick={() => { setLoginType('user'); setLoginError(""); }}>User</button>
                    <button className={`admin-login-btn${loginType === 'admin' ? ' active' : ''}`} style={{padding: '0.5rem 1.5rem', background: loginType === 'admin' ? '#333' : '#bbb', color: loginType === 'admin' ? '#fff' : '#222'}} onClick={() => { setLoginType('admin'); setLoginError(""); }}>Admin</button>
                  </div>
                  <form onSubmit={handleLogin} className="admin-login-form">
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="admin-login-input"
                      autoFocus
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="admin-login-input"
                    />
                    {loginError && <div className="admin-login-error">{loginError}</div>}
                    <div className="admin-login-actions">
                      <button type="submit" className="admin-login-btn">Login</button>
                      <button type="button" className="admin-cancel-btn" onClick={() => { setShowLogin(false); setLoginError(""); }}>Cancel</button>
                    </div>
                  </form>
                  <div className="admin-login-footer">{loginType === 'user' ? 'Login as a user to shop.' : 'Admin access only.'}</div>
                </div>
              </div>
            )}
            {/* End Login Popup */}
            <div className="brand-logo-container">
              <img src={logoImage} alt="Live Art Logo" className="brand-logo" />
            </div>
            <h1 className="brand-name">LIVE ART</h1>
            <p className="brand-slogan">Express Yourself Through Fashion</p>
            <button className="shop-now-btn" onClick={handleShopNow}>
              Shop Now
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HomeLiveArt;
