// src/components/LoginPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState({ email: false, password: false });

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (token && role === 'admin') {
      navigate('/admin');
    }
  }, [navigate]);

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim()) {
      return 'Email is required';
    } else if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  // Validate password
  const validatePassword = (password) => {
    if (!password.trim()) {
      return 'Password is required';
    } else if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };

  // Validate field on change
  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return validateEmail(value);
      case 'password':
        return validatePassword(value);
      default:
        return '';
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate only if field has been touched
    if (touchedFields[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Mark field as touched
    setTouchedFields(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate field
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const validateForm = () => {
    const newErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password)
    };
    
    setErrors(newErrors);
    setTouchedFields({ email: true, password: true });
    
    // Return true if no errors
    return !Object.values(newErrors).some(error => error);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Validate all fields before submission
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      const { token, user } = res.data;

      // Save token & role
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      localStorage.setItem('userName', user.name);

      // If admin, go to admin dashboard
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'employee') {
        navigate('/employee');
      } else {
        navigate('/shop');
      }
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.msg || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container" data-aos="fade-up">
        <div className="login-form-container container slide-up animate__animated animate__fadeIn">
          <div className="login-logo">
            <i className="fas fa-tshirt fa-3x"></i>
            <h1>LiveArt</h1>
            <p className="tagline">Premium Clothing Experience</p>
          </div>
          
          <h2>Sign In</h2>
          
          {formError && (
            <div className="alert alert-error">
              <i className="fas fa-exclamation-circle"></i> {formError}
            </div>
          )}
          
          <form onSubmit={onSubmit} noValidate>
            <div className={`form-control ${errors.email && touchedFields.email ? 'has-error' : ''}`}>
              <label htmlFor="email">
                <i className="fas fa-envelope"></i> Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                onBlur={handleBlur}
                placeholder="Enter your email"
                className={errors.email && touchedFields.email ? 'input-error' : ''}
                required
              />
              {errors.email && touchedFields.email && (
                <div className="error-message">
                  <i className="fas fa-exclamation-circle"></i> {errors.email}
                </div>
              )}
            </div>
            
            <div className={`form-control ${errors.password && touchedFields.password ? 'has-error' : ''}`}>
              <label htmlFor="password">
                <i className="fas fa-lock"></i> Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={onChange}
                onBlur={handleBlur}
                placeholder="Enter your password"
                className={errors.password && touchedFields.password ? 'input-error' : ''}
                required
              />
              {errors.password && touchedFields.password && (
                <div className="error-message">
                  <i className="fas fa-exclamation-circle"></i> {errors.password}
                </div>
              )}
            </div>
            
            <button 
              type="submit" 
              className={`btn btn-primary btn-block ${isLoading ? 'loading' : ''}`}
              disabled={isLoading || (touchedFields.email && touchedFields.password && (errors.email || errors.password))}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Signing In...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i> Sign In
                </>
              )}
            </button>
          </form>
          
          <div className="login-footer">
            <p>
              Don't have an account? <a href="/register" className="register-link">Create Account</a>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
        }
        
        .login-container {
          width: 100%;
          max-width: 450px;
          padding: 1rem;
        }
        
        .login-form-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          padding: 2.5rem;
        }
        
        .login-logo {
          text-align: center;
          margin-bottom: 2rem;
          color: #333;
        }
        
        .login-logo h1 {
          margin: 0.8rem 0 0.2rem;
          font-weight: 700;
          font-size: 2.2rem;
        }
        
        .tagline {
          font-size: 1rem;
          color: #666;
          margin-top: 0.2rem;
        }
        
        .form-control {
          margin-bottom: 1.2rem;
        }
        
        .form-control.has-error input {
          border-color: #e74c3c;
          background-color: rgba(231, 76, 60, 0.05);
        }
        
        .error-message {
          color: #e74c3c;
          font-size: 0.8rem;
          margin-top: 0.3rem;
          display: flex;
          align-items: center;
        }
        
        .error-message i {
          margin-right: 0.3rem;
        }
        
        .btn-block {
          width: 100%;
          margin: 1.5rem 0 1rem;
          padding: 0.8rem;
          font-size: 1rem;
        }
        
        .loading {
          opacity: 0.8;
          cursor: not-allowed;
        }
        
        .login-footer {
          text-align: center;
          margin-top: 1.5rem;
          color: #666;
        }
        
        .register-link {
          color: #333;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          border-bottom: 1px solid transparent;
        }
        
        .register-link:hover {
          border-bottom: 1px solid #333;
        }
        
        button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .input-error {
          animation: shake 0.5s;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;