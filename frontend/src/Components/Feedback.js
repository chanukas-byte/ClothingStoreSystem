import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaStar } from 'react-icons/fa';
import './Feedback.css'; // Import the CSS file
import axios from 'axios';

function Feedback() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    message: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear any error when user starts typing
    if (error) setError('');
  };

  const handleRatingChange = (rating) => {
    setFormData(prevState => ({
      ...prevState,
      rating: rating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all fields');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Rating validation
    if (formData.rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    try {
      await axios.post('http://localhost:4058/api/feedback', {
        name: formData.name,
        email: formData.email,
        rating: formData.rating,
        comments: formData.message
      });
      
      // Show success message with SweetAlert and automatically navigate
      Swal.fire({
        title: 'Thank You!',
        text: 'Your feedback has been submitted successfully.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        // Navigate to feedback list automatically
        navigate('/feedback-list');
      });
      
      setShowSuccess(true);
      setError('');
      setFormData({
        name: '',
        email: '',
        rating: 0,
        message: ''
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError('Failed to submit feedback. Please try again later.');
    }
  };

  return (
    <div className="feedback-page">
      <Container className="feedback-container">
        <div className="feedback-header">
          <h2>Send Us Your Feedback</h2>
          <p>We value your opinion! Please share your thoughts with us.</p>
        </div>

        {showSuccess && (
          <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible className="feedback-alert">
            Thank you for your feedback! We appreciate your input.
          </Alert>
        )}

        {error && (
          <Alert variant="danger" onClose={() => setError('')} dismissible className="feedback-alert">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit} className="feedback-form">
          <Form.Group className="form-group">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label>Rating</Form.Label>
            <div className="rating-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`star ${star <= formData.rating ? 'active' : ''}`}
                  onClick={() => handleRatingChange(star)}
                />
              ))}
              {formData.rating > 0 && (
                <span className="rating-text">{formData.rating} {formData.rating === 1 ? 'Star' : 'Stars'}</span>
              )}
            </div>
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Enter your message"
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="submit-button">
            Submit Feedback
          </Button>
        </Form>
      </Container>
    </div>
  );
}

export default Feedback; 