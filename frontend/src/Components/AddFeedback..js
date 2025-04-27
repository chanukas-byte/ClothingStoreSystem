import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddFeedback.css';
import { FaStar, FaUser, FaEnvelope, FaComment, FaPaperPlane, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import logo from '../assets/logo.png';
import NavB from './NavBar';

const AddFeedback = () => {
  const [feedback, setFeedback] = useState({
    name: '',
    email: '',
    rating: 5,
    comments: ''
  });
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    comments: ''
  });
  
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    comments: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  // Validate form whenever feedback or touched state changes
  useEffect(() => {
    validateForm();
  }, [feedback, touched]);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Name validation
    if (touched.name) {
      if (!feedback.name.trim()) {
        newErrors.name = 'Name is required';
        isValid = false;
      } else if (feedback.name.length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
        isValid = false;
      } else if (!/^[a-zA-Z\s]*$/.test(feedback.name)) {
        newErrors.name = 'Name can only contain letters and spaces';
        isValid = false;
      } else if (/[!@#$%^&*(),.?":{}|<>]/.test(feedback.name)) {
        newErrors.name = 'Name cannot contain special characters';
        isValid = false;
      }
    }

    // Email validation
    if (touched.email) {
      if (!feedback.email.trim()) {
        newErrors.email = 'Email is required';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(feedback.email)) {
        newErrors.email = 'Please enter a valid email address';
        isValid = false;
      }
    }

    // Comments validation
    if (touched.comments) {
      if (!feedback.comments.trim()) {
        newErrors.comments = 'Comments are required';
        isValid = false;
      } else if (feedback.comments.length < 10) {
        newErrors.comments = 'Comments must be at least 10 characters';
        isValid = false;
      } else if (feedback.comments.length > 500) {
        newErrors.comments = 'Comments cannot exceed 500 characters';
        isValid = false;
      } else if (/[<>{}]/.test(feedback.comments)) {
        newErrors.comments = 'Comments cannot contain HTML-like tags';
        isValid = false;
      }
    }

    setErrors(newErrors);
    setIsFormValid(isValid && touched.name && touched.email && touched.comments);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Prevent special characters in name field
    if (name === 'name') {
      const sanitizedValue = value.replace(/[!@#$%^&*(),.?":{}|<>]/g, '');
      setFeedback({
        ...feedback,
        [name]: sanitizedValue
      });
    } else {
      setFeedback({
        ...feedback,
        [name]: value
      });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched to trigger validation
    setTouched({
      name: true,
      email: true,
      comments: true
    });
    
    // Validate form before submission
    validateForm();
    
    if (!isFormValid) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please correct the errors in the form before submitting.',
        icon: 'error',
        confirmButtonColor: '#000000'
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      await axios.post('http://localhost:4058/api/feedback/submit', feedback);
      
      Swal.fire({
        title: 'Success!',
        text: 'Your feedback has been submitted successfully.',
        icon: 'success',
        confirmButtonColor: '#000000'
      }).then(() => {
        navigate('/feedback-list');
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to submit feedback. Please try again later.',
        icon: 'error',
        confirmButtonColor: '#000000'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <NavB />

    <div className="add-feedback-container">
      <div className="add-feedback-header">
        <div className="logo-container">
          <img src={logo} alt="Live Art Clothings Logo" />
        </div>
        <h2>Share Your Feedback</h2>
        <p>We value your opinion! Please let us know about your experience.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="add-feedback-form">
        <div className="form-group">
          <label htmlFor="name">
            <FaUser className="form-icon" />
            Name
          </label>
          <div className="input-container">
            <input
              type="text"
              id="name"
              name="name"
              value={feedback.name}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              placeholder="Enter your name"
              className={touched.name && errors.name ? 'error' : touched.name && !errors.name ? 'valid' : ''}
            />
            {touched.name && errors.name && (
              <div className="error-message">
                <FaExclamationTriangle className="error-icon" />
                {errors.name}
              </div>
            )}
            {touched.name && !errors.name && (
              <div className="valid-message">
                <FaCheck className="valid-icon" />
                Looks good!
              </div>
            )}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="email">
            <FaEnvelope className="form-icon" />
            Email
          </label>
          <div className="input-container">
            <input
              type="email"
              id="email"
              name="email"
              value={feedback.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              placeholder="Enter your email"
              className={touched.email && errors.email ? 'error' : touched.email && !errors.email ? 'valid' : ''}
            />
            {touched.email && errors.email && (
              <div className="error-message">
                <FaExclamationTriangle className="error-icon" />
                {errors.email}
              </div>
            )}
            {touched.email && !errors.email && (
              <div className="valid-message">
                <FaCheck className="valid-icon" />
                Looks good!
              </div>
            )}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="rating">
            <FaStar className="form-icon" />
            Rating
          </label>
          <div className="rating-container">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`rating-star ${feedback.rating >= star ? 'active' : ''}`}
                onClick={() => setFeedback({ ...feedback, rating: star })}
              />
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="comments">
            <FaComment className="form-icon" />
            Comments
          </label>
          <div className="input-container">
            <textarea
              id="comments"
              name="comments"
              value={feedback.comments}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              placeholder="Share your thoughts with us"
              rows="5"
              className={touched.comments && errors.comments ? 'error' : touched.comments && !errors.comments ? 'valid' : ''}
            ></textarea>
            {touched.comments && errors.comments && (
              <div className="error-message">
                <FaExclamationTriangle className="error-icon" />
                {errors.comments}
              </div>
            )}
            {touched.comments && !errors.comments && (
              <div className="valid-message">
                <FaCheck className="valid-icon" />
                Looks good!
              </div>
            )}
          </div>
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting || !isFormValid}
        >
          {isSubmitting ? 'Submitting...' : (
            <>
              <FaPaperPlane className="submit-icon" />
              Submit Feedback
            </>
          )}
        </button>
      </form>
    </div>
    </div>
  );
};

export default AddFeedback;c