// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  if (!token) {
    // Not logged in
    return <Navigate to="/" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Not authorized
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  useEffect(() => {
    // Initialize AOS animation library
    if (window.AOS) {
      window.AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Default route: login */}
        <Route path="/" element={<LoginPage />} />
        
        {/* Register route: for customers */}
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Admin routes: protected with role check */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback route for any undefined paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;