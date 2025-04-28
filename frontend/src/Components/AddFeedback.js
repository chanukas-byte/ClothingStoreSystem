import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddFeedback.css';
import { FaStar } from 'react-icons/fa';
import Swal from 'sweetalert2';
import logo from '../assets/logo.png';

const AddFeedback = () => {
  const [feedback, setFeedback] = useState({
    name: '',
    email: '',
    rating: 5,
    comments: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback({
      ...feedback,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post('http://localhost:4058/api/feedback', {
        name: feedback.name,
        email: feedback.email,
        rating: feedback.rating,
        comments: feedback.comments
      });
      
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
    <div className="add-feedback-container">
      <div className="add-feedback-header">
        <h2>Share Your Feedback</h2>
        <p>We value your opinion! Please let us know about your experience.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="add-feedback-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={feedback.name}
            onChange={handleChange}
            required
            placeholder="Enter your name"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={feedback.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="rating">Rating</label>
          <div className="rating-container">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`rating-star ${feedback.rating >= star ? 'active' : ''}`}
                onClick={() => setFeedback({ ...feedback, rating: star })}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="comments">Comments</label>
          <textarea
            id="comments"
            name="comments"
            value={feedback.comments}
            onChange={handleChange}
            required
            placeholder="Share your thoughts with us"
            rows="5"
          ></textarea>
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};

export default AddFeedback;