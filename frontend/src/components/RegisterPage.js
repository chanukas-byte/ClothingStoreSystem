// src/components/RegisterPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    dateOfBirth: '',
    mobileNumber: '',
    address: ''
  });
  
  // State for field-level validation errors
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    dateOfBirth: '',
    mobileNumber: '',
    address: ''
  });
  
  // State for touched fields
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    gender: false,
    dateOfBirth: false,
    mobileNumber: false,
    address: false
  });
  
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  // Calculate max date (18 years ago) for date of birth
  const getMaxDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    return date.toISOString().split('T')[0];
  };
  
  // Validate name
  const validateName = (name) => {
    if (!name.trim()) {
      return 'Name is required';
    } else if (name.trim().length < 2) {
      return 'Name must be at least 2 characters';
    } else if (name.trim().length > 50) {
      return 'Name must be less than 50 characters';
    } else if (!/^[a-zA-Z\s'-]+$/.test(name)) {
      return 'Name can only contain letters, spaces, hyphens, and apostrophes';
    }
    return '';
  };
  
  // Validate email
  const validateEmail = (email) => {
    if (!email.trim()) {
      return 'Email is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };
  
  // Validate password
  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    } else if (password.length < 6) {
      return 'Password must be at least 6 characters';
    } else if (password.length > 50) {
      return 'Password must be less than 50 characters';
    } else if (!/\d/.test(password)) {
      return 'Password must include at least one number';
    } else if (!/[a-zA-Z]/.test(password)) {
      return 'Password must include at least one letter';
    }
    return '';
  };
  
  // Validate confirm password
  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) {
      return 'Please confirm your password';
    } else if (confirmPassword !== password) {
      return 'Passwords do not match';
    }
    return '';
  };
  
  // Validate gender
  const validateGender = (gender) => {
    if (!gender) {
      return 'Please select your gender';
    }
    return '';
  };
  
  // Validate date of birth
  const validateDateOfBirth = (dob) => {
    if (!dob) {
      return 'Date of birth is required';
    }
    
    const dobDate = new Date(dob);
    const today = new Date();
    const minDate = new Date();
    const maxDate = new Date();
    
    // Set min date (100 years ago)
    minDate.setFullYear(today.getFullYear() - 100);
    
    // Set max date (18 years ago)
    maxDate.setFullYear(today.getFullYear() - 18);
    
    if (dobDate > maxDate) {
      return 'You must be at least 18 years old to register';
    } else if (dobDate < minDate) {
      return 'Please enter a valid date of birth';
    }
    
    return '';
  };
  
  // Validate mobile number
  const validateMobileNumber = (mobile) => {
    if (!mobile) {
      return 'Mobile number is required';
    } else if (!/^\d{10,15}$/.test(mobile.replace(/[-()\s]/g, ''))) {
      return 'Please enter a valid mobile number (10-15 digits)';
    }
    return '';
  };
  
  // Validate address
  const validateAddress = (address) => {
    if (!address.trim()) {
      return 'Address is required';
    } else if (address.trim().length < 5) {
      return 'Please enter a complete address';
    } else if (address.trim().length > 200) {
      return 'Address must be less than 200 characters';
    }
    return '';
  };
  
  // Generic field validator
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return validateName(value);
      case 'email':
        return validateEmail(value);
      case 'password':
        return validatePassword(value);
      case 'confirmPassword':
        return validateConfirmPassword(value, formData.password);
      case 'gender':
        return validateGender(value);
      case 'dateOfBirth':
        return validateDateOfBirth(value);
      case 'mobileNumber':
        return validateMobileNumber(value);
      case 'address':
        return validateAddress(value);
      default:
        return '';
    }
  };
  
  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // If confirming password, we need to validate it against the current password
    if (name === 'password' && touched.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: validateConfirmPassword(formData.confirmPassword, value)
      }));
    }
    
    // If field is touched, validate on change
    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };
  
  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate field
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };
  
  // Validate first step
  const validateStep1 = () => {
    const step1Fields = ['name', 'email', 'password', 'confirmPassword'];
    const newErrors = { ...errors };
    const newTouched = { ...touched };
    
    // Mark all step 1 fields as touched
    step1Fields.forEach(field => {
      newTouched[field] = true;
      newErrors[field] = validateField(field, formData[field]);
    });
    
    setTouched(newTouched);
    setErrors(newErrors);
    
    // Check if any step 1 field has an error
    return !step1Fields.some(field => newErrors[field]);
  };
  
  // Validate second step
  const validateStep2 = () => {
    const step2Fields = ['gender', 'dateOfBirth', 'mobileNumber', 'address'];
    const newErrors = { ...errors };
    const newTouched = { ...touched };
    
    // Mark all step 2 fields as touched
    step2Fields.forEach(field => {
      newTouched[field] = true;
      newErrors[field] = validateField(field, formData[field]);
    });
    
    setTouched(newTouched);
    setErrors(newErrors);
    
    // Check if any step 2 field has an error
    return !step2Fields.some(field => newErrors[field]);
  };
  
  const nextStep = () => {
    if (validateStep1()) {
      setStep(2);
      setFormError('');
    } else {
      setFormError('Please fix the errors in the form before proceeding.');
    }
  };
  
  const prevStep = () => {
    setStep(1);
    setFormError('');
  };
  
  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields in step 2
    if (!validateStep2()) {
      setFormError('Please fix the errors in the form before submitting.');
      return;
    }
    
    setFormError('');
    setSuccess('');
    setIsLoading(true);
    
    // Remove confirmPassword from data sent to API
    const { confirmPassword, ...submissionData } = formData;
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', submissionData);
      setSuccess(res.data.msg || 'Registration successful! Redirecting to login...');
      
      // Scroll to top to ensure success message is visible
      window.scrollTo(0, 0);
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.msg || 'Registration failed. Please try again.');
      window.scrollTo(0, 0);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="register-page">
      <div className="register-container" data-aos="fade-up">
        <div className="register-form-container container scale-in animate__animated animate__fadeIn">
          <div className="register-logo">
            <i className="fas fa-tshirt fa-3x"></i>
            <h1>LiveArt</h1>
            <p className="tagline">Join Our Community</p>
          </div>
          
          <h2>Create Account</h2>
          
          {formError && (
            <div className="alert alert-error">
              <i className="fas fa-exclamation-circle"></i> {formError}
            </div>
          )}
          
          {success && (
            <div className="alert alert-success">
              <i className="fas fa-check-circle"></i> {success}
            </div>
          )}
          
          <div className="step-indicator">
            <div className={`step ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-title">Account Details</div>
            </div>
            <div className="step-line"></div>
            <div className={`step ${step === 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-title">Personal Information</div>
            </div>
          </div>
          
          <form onSubmit={onSubmit} noValidate>
            {step === 1 && (
              <div className="step-content animate__animated animate__fadeIn">
                <div className={`form-control ${errors.name && touched.name ? 'has-error' : ''}`}>
                  <label htmlFor="name">
                    <i className="fas fa-user"></i> Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    onBlur={handleBlur}
                    placeholder="Enter your full name"
                    className={errors.name && touched.name ? 'input-error' : ''}
                    required
                  />
                  {errors.name && touched.name && (
                    <div className="error-message">
                      <i className="fas fa-exclamation-circle"></i> {errors.name}
                    </div>
                  )}
                </div>
                
                <div className={`form-control ${errors.email && touched.email ? 'has-error' : ''}`}>
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
                    className={errors.email && touched.email ? 'input-error' : ''}
                    required
                  />
                  {errors.email && touched.email && (
                    <div className="error-message">
                      <i className="fas fa-exclamation-circle"></i> {errors.email}
                    </div>
                  )}
                </div>
                
                <div className={`form-control ${errors.password && touched.password ? 'has-error' : ''}`}>
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
                    placeholder="Create a password"
                    className={errors.password && touched.password ? 'input-error' : ''}
                    required
                  />
                  {errors.password && touched.password && (
                    <div className="error-message">
                      <i className="fas fa-exclamation-circle"></i> {errors.password}
                    </div>
                  )}
                </div>
                
                <div className={`form-control ${errors.confirmPassword && touched.confirmPassword ? 'has-error' : ''}`}>
                  <label htmlFor="confirmPassword">
                    <i className="fas fa-lock"></i> Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={onChange}
                    onBlur={handleBlur}
                    placeholder="Confirm your password"
                    className={errors.confirmPassword && touched.confirmPassword ? 'input-error' : ''}
                    required
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <div className="error-message">
                      <i className="fas fa-exclamation-circle"></i> {errors.confirmPassword}
                    </div>
                  )}
                </div>
                
                <div className="form-buttons">
                  <button 
                    type="button" 
                    className="btn"
                    onClick={nextStep}
                  >
                    Next <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="step-content animate__animated animate__fadeIn">
                <div className={`form-control ${errors.gender && touched.gender ? 'has-error' : ''}`}>
                  <label htmlFor="gender">
                    <i className="fas fa-venus-mars"></i> Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={onChange}
                    onBlur={handleBlur}
                    className={errors.gender && touched.gender ? 'input-error' : ''}
                    required
                  >
                    <option value="">-- Select Gender --</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && touched.gender && (
                    <div className="error-message">
                      <i className="fas fa-exclamation-circle"></i> {errors.gender}
                    </div>
                  )}
                </div>
                
                <div className={`form-control ${errors.dateOfBirth && touched.dateOfBirth ? 'has-error' : ''}`}>
                  <label htmlFor="dateOfBirth">
                    <i className="fas fa-calendar-alt"></i> Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    max={getMaxDate()}
                    value={formData.dateOfBirth}
                    onChange={onChange}
                    onBlur={handleBlur}
                    className={errors.dateOfBirth && touched.dateOfBirth ? 'input-error' : ''}
                    required
                  />
                  {errors.dateOfBirth && touched.dateOfBirth && (
                    <div className="error-message">
                      <i className="fas fa-exclamation-circle"></i> {errors.dateOfBirth}
                    </div>
                  )}
                </div>
                
                <div className={`form-control ${errors.mobileNumber && touched.mobileNumber ? 'has-error' : ''}`}>
                  <label htmlFor="mobileNumber">
                    <i className="fas fa-mobile-alt"></i> Mobile Number
                  </label>
                  <input
                    type="tel"
                    id="mobileNumber"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={onChange}
                    onBlur={handleBlur}
                    placeholder="Enter your mobile number"
                    className={errors.mobileNumber && touched.mobileNumber ? 'input-error' : ''}
                    required
                  />
                  {errors.mobileNumber && touched.mobileNumber && (
                    <div className="error-message">
                      <i className="fas fa-exclamation-circle"></i> {errors.mobileNumber}
                    </div>
                  )}
                </div>
                
                <div className={`form-control ${errors.address && touched.address ? 'has-error' : ''}`}>
                  <label htmlFor="address">
                    <i className="fas fa-map-marker-alt"></i> Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={onChange}
                    onBlur={handleBlur}
                    placeholder="Enter your address"
                    className={errors.address && touched.address ? 'input-error' : ''}
                    required
                  />
                  {errors.address && touched.address && (
                    <div className="error-message">
                      <i className="fas fa-exclamation-circle"></i> {errors.address}
                    </div>
                  )}
                </div>
                
                <div className="form-buttons">
                  <button type="button" className="btn btn-outline" onClick={prevStep}>
                    <i className="fas fa-arrow-left"></i> Back
                  </button>
                  <button 
                    type="submit" 
                    className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading || Object.values(errors).some(error => error !== '')}
                  >
                    {isLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Creating Account...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-user-plus"></i> Create Account
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
          
          <div className="register-footer">
            <p>
              Already have an account? <a href="/" className="login-link">Sign In</a>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .register-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
          padding: 2rem 0;
        }
        
        .register-container {
          width: 100%;
          max-width: 550px;
          padding: 1rem;
        }
        
        .register-form-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          padding: 2.5rem;
        }
        
        .register-logo {
          text-align: center;
          margin-bottom: 2rem;
          color: #333;
        }
        
        .register-logo h1 {
          margin: 0.8rem 0 0.2rem;
          font-weight: 700;
          font-size: 2.2rem;
        }
        
        .tagline {
          font-size: 1rem;
          color: #666;
          margin-top: 0.2rem;
        }
        
        .step-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 2rem 0;
        }
        
        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 120px;
        }
        
        .step-number {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #e0e0e0;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          margin-bottom: 0.5rem;
          transition: all 0.3s ease;
        }
        
        .step-title {
          font-size: 0.8rem;
          color: #666;
          text-align: center;
        }
        
        .step.active .step-number {
          background-color: #333;
          color: white;
        }
        
        .step.active .step-title {
          color: #333;
          font-weight: 600;
        }
        
        .step.completed .step-number {
          background-color: #4caf50;
          color: white;
        }
        
        .step-line {
          height: 2px;
          background-color: #e0e0e0;
          flex-grow: 1;
          margin: 0 10px;
          margin-bottom: 1.5rem;
        }
        
        .form-control {
          margin-bottom: 1.2rem;
        }
        
        .form-control.has-error input,
        .form-control.has-error select {
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
        
        .form-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 1.5rem;
        }
        
        .btn {
          min-width: 120px;
        }
        
        .form-buttons .btn:only-child {
          margin-left: auto;
        }
        
        .register-footer {
          text-align: center;
          margin-top: 1.5rem;
          color: #666;
        }
        
        .login-link {
          color: #333;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          border-bottom: 1px solid transparent;
        }
        
        .login-link:hover {
          border-bottom: 1px solid #333;
        }
        
        .step-content {
          min-height: 300px;
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
        
        /* Add some space for error messages */
        .form-control {
          margin-bottom: 1.5rem;
        }
        
        /* Alert styles */
        .alert {
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
        }
        
        .alert i {
          margin-right: 0.5rem;
          font-size: 1.2rem;
        }
        
        .alert-error {
          background-color: rgba(231, 76, 60, 0.1);
          color: #e74c3c;
          border-left: 4px solid #e74c3c;
        }
        
        .alert-success {
          background-color: rgba(46, 204, 113, 0.1);
          color: #2ecc71;
          border-left: 4px solid #2ecc71;
        }
        
        /* Responsive adjustments */
        @media (max-width: 580px) {
          .register-form-container {
            padding: 1.5rem;
          }
          
          .step-indicator {
            margin: 1.5rem 0;
          }
          
          .step-title {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;