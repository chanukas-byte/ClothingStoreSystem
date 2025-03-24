// src/components/AdminNavbar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState('Admin');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path || 
           (path !== '/admin' && location.pathname.startsWith(path));
  };

  return (
    <>
      <nav className="admin-navbar">
        <div className="navbar-brand">
          <Link to="/admin" className="brand-logo">
            <i className="fas fa-tshirt"></i>
            <span>LiveArt</span>
          </Link>
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>

        <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-nav">
            <li className={`nav-item ${isActive('/admin') && !isActive('/admin/users') ? 'active' : ''}`}>
              <Link to="/admin" className="nav-link">
                <i className="fas fa-chart-line"></i>
                <span>Dashboard</span>
              </Link>
            </li>
            <li className={`nav-item ${isActive('/admin/users') ? 'active' : ''}`}>
              <Link to="/admin/users" className="nav-link">
                <i className="fas fa-users"></i>
                <span>Users</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/inventory" className="nav-link">
                <i className="fas fa-box-open"></i>
                <span>Inventory</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/orders" className="nav-link">
                <i className="fas fa-shopping-bag"></i>
                <span>Orders</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/reports" className="nav-link">
                <i className="fas fa-file-alt"></i>
                <span>Reports</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="navbar-user">
          <div className="user-dropdown">
            <button className="dropdown-toggle">
              <div className="user-avatar">
                <i className="fas fa-user"></i>
              </div>
              <span className="user-name">{userName}</span>
              <i className="fas fa-chevron-down"></i>
            </button>
            <div className="dropdown-menu">
              <Link to="/admin/profile" className="dropdown-item">
                <i className="fas fa-user-circle"></i> Profile
              </Link>
              <Link to="/admin/settings" className="dropdown-item">
                <i className="fas fa-cog"></i> Settings
              </Link>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <style jsx>{`
        .admin-navbar {
          display: flex;
          align-items: center;
          background-color: #000;
          color: #fff;
          padding: 0.8rem 2rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        
        .navbar-brand {
          display: flex;
          align-items: center;
          margin-right: 2rem;
        }
        
        .brand-logo {
          display: flex;
          align-items: center;
          color: #fff;
          text-decoration: none;
          font-weight: 700;
          font-size: 1.3rem;
          transition: all 0.3s ease;
        }
        
        .brand-logo i {
          margin-right: 0.5rem;
          font-size: 1.5rem;
        }
        
        .brand-logo:hover {
          opacity: 0.9;
        }
        
        .navbar-menu {
          flex-grow: 1;
        }
        
        .navbar-nav {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        
        .nav-item {
          margin-right: 0.5rem;
          position: relative;
        }
        
        .nav-link {
          display: flex;
          align-items: center;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          padding: 0.8rem 1rem;
          border-radius: 4px;
          transition: all 0.3s ease;
        }
        
        .nav-link i {
          margin-right: 0.5rem;
          font-size: 1rem;
        }
        
        .nav-link:hover, .nav-item.active .nav-link {
          color: #fff;
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .nav-item.active::after {
          content: '';
          position: absolute;
          bottom: -0.8rem;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 6px;
          background-color: #fff;
          border-radius: 50%;
        }
        
        .navbar-user {
          margin-left: auto;
        }
        
        .user-dropdown {
          position: relative;
        }
        
        .dropdown-toggle {
          display: flex;
          align-items: center;
          background: none;
          border: none;
          color: #fff;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 4px;
          transition: all 0.3s ease;
        }
        
        .dropdown-toggle:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .user-avatar {
          width: 32px;
          height: 32px;
          background-color: #333;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 0.5rem;
        }
        
        .user-name {
          margin-right: 0.5rem;
          font-weight: 500;
        }
        
        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background-color: #fff;
          border-radius: 4px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          width: 200px;
          z-index: 1000;
          margin-top: 0.5rem;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.3s ease;
        }
        
        .user-dropdown:hover .dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        
        .dropdown-item {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: #333;
          padding: 0.8rem 1rem;
          transition: all 0.3s ease;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          font-size: 0.9rem;
        }
        
        .dropdown-item i {
          margin-right: 0.5rem;
        }
        
        .dropdown-item:hover {
          background-color: #f5f5f5;
        }
        
        .dropdown-divider {
          height: 1px;
          background-color: #e0e0e0;
          margin: 0.5rem 0;
        }
        
        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          color: #fff;
          font-size: 1.5rem;
          cursor: pointer;
        }
        
        @media (max-width: 768px) {
          .admin-navbar {
            padding: 0.8rem 1rem;
          }
          
          .mobile-menu-toggle {
            display: block;
            margin-left: auto;
          }
          
          .navbar-menu {
            position: fixed;
            top: 60px;
            left: 0;
            width: 100%;
            background-color: #000;
            padding: 1rem;
            height: calc(100vh - 60px);
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }
          
          .navbar-menu.active {
            transform: translateX(0);
          }
          
          .navbar-nav {
            flex-direction: column;
          }
          
          .nav-item {
            margin-right: 0;
            margin-bottom: 0.5rem;
          }
          
          .nav-item.active::after {
            display: none;
          }
          
          .navbar-user {
            margin-left: 0;
          }
        }
      `}</style>
    </>
  );
};

export default AdminNavbar;