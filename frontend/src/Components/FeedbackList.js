import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaStar, FaSearch, FaDownload } from 'react-icons/fa';
import './FeedbackList.css';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../assets/logo.png';

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFeedback, setEditedFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get('http://localhost:4058/api/feedback/');
        setFeedbacks(response.data);
        setFilteredFeedbacks(response.data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to load feedback data. Please try again later.',
          icon: 'error',
          confirmButtonColor: '#000000'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  // Filter feedbacks based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredFeedbacks(feedbacks);
    } else {
      const filtered = feedbacks.filter(feedback => {
        // Add null checks before calling toLowerCase()
        const name = feedback.name ? feedback.name.toLowerCase() : '';
        const email = feedback.email ? feedback.email.toLowerCase() : '';
        const comments = feedback.comments ? feedback.comments.toLowerCase() : '';
        const rating = feedback.rating ? feedback.rating.toString() : '';
        
        return name.includes(searchTerm.toLowerCase()) ||
               email.includes(searchTerm.toLowerCase()) ||
               comments.includes(searchTerm.toLowerCase()) ||
               rating.includes(searchTerm);
      });
      setFilteredFeedbacks(filtered);
    }
  }, [searchTerm, feedbacks]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const deleteFeedback = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#000000',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:4058/api/feedback/${id}`);
        setFeedbacks(feedbacks.filter(feedback => feedback._id !== id));
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Your feedback has been deleted.',
          icon: 'success',
          confirmButtonColor: '#000000'
        });
      } catch (error) {
        console.error("Error deleting feedback:", error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to delete feedback. Please try again later.',
          icon: 'error',
          confirmButtonColor: '#000000'
        });
      }
    }
  };

  const editFeedback = (feedback) => {
    setIsEditing(true);
    setEditedFeedback(feedback);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedFeedback((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateFeedback = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.put(`http://localhost:4058/api/feedback/${editedFeedback._id}`, editedFeedback);
      
      const updatedFeedbacks = feedbacks.map(feedback =>
        feedback._id === editedFeedback._id ? response.data : feedback
      );
      
      setFeedbacks(updatedFeedbacks);
      setIsEditing(false);
      setEditedFeedback(null);
      
      Swal.fire({
        title: 'Updated!',
        text: 'Your feedback has been updated successfully.',
        icon: 'success',
        confirmButtonColor: '#000000'
      });
    } catch (error) {
      console.error("Error updating feedback:", error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to update feedback. Please try again later.',
        icon: 'error',
        confirmButtonColor: '#000000'
      });
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="rating-stars">
        {[...Array(5)].map((_, index) => (
          <FaStar 
            key={index} 
            style={{ 
              color: index < rating ? '#000000' : '#ddd',
              fontSize: '1rem'
            }} 
          />
        ))}
      </div>
    );
  };

  const downloadPDF = () => {
    try {
      // Create a new PDF document
      const doc = new jsPDF();
      
      // Add logo
      doc.addImage(logo, 'PNG', 15, 10, 30, 30);
      
      // Add title
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 0);
      doc.text('Customer Feedback Report', 105, 25, { align: 'center' });
      
      // Add date
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      const today = new Date().toLocaleDateString();
      doc.text(`Generated on: ${today}`, 105, 35, { align: 'center' });
      
      // Add border
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.rect(10, 5, 190, 280);
      
      // Create table data
      const tableData = filteredFeedbacks.map((feedback, index) => [
        index + 1,
        feedback.name || '',
        feedback.email || '',
        feedback.rating || '',
        feedback.comments || ''
      ]);
      
      // Add table using the autoTable plugin
      autoTable(doc, {
        startY: 50,
        head: [['#', 'Name', 'Email', 'Rating', 'Comments']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [0, 0, 0],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        styles: {
          fontSize: 10,
          cellPadding: 5
        },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          1: { cellWidth: 40 },
          2: { cellWidth: 50 },
          3: { cellWidth: 20, halign: 'center' },
          4: { cellWidth: 'auto' }
        }
      });
      
      // Save the PDF
      doc.save('customer-feedback-report.pdf');
      
      // Show success message
      Swal.fire({
        title: 'PDF Downloaded!',
        text: 'Your feedback report has been downloaded successfully.',
        icon: 'success',
        confirmButtonColor: '#000000'
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to generate PDF report. Please try again later.',
        icon: 'error',
        confirmButtonColor: '#000000'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="feedback-list-container">
        <div className="feedback-list-header">
          <h2>Loading Feedback...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-list-container">
      <div className="feedback-list-header">
        <h2>Customer Feedback</h2>
        <p>View and manage customer feedback</p>
      </div>

      {isEditing ? (
        <form onSubmit={updateFeedback} className="edit-form">
          <h3>Edit Feedback</h3>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              value={editedFeedback.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={editedFeedback.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="rating">Rating (1-5)</label>
            <input
              type="number"
              name="rating"
              value={editedFeedback.rating}
              onChange={handleChange}
              min="1"
              max="5"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="comments">Comments</label>
            <textarea
              name="comments"
              value={editedFeedback.comments}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button type="submit" className="update-button">
            Update Feedback
          </button>
        </form>
      ) : (
        <>
          <div className="feedback-controls">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <button className="download-button" onClick={downloadPDF}>
              <FaDownload /> Download PDF Report
            </button>
          </div>

          {filteredFeedbacks.length > 0 ? (
            <table className="feedback-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Rating</th>
                  <th>Comments</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeedbacks.map((feedback, index) => (
                  <tr key={feedback._id}>
                    <td className="feedback-number">{index + 1}</td>
                    <td>{feedback.name || ''}</td>
                    <td>{feedback.email || ''}</td>
                    <td>
                      <div className="feedback-rating">
                        {feedback.rating || 0}
                        {renderStars(feedback.rating || 0)}
                      </div>
                    </td>
                    <td>{feedback.comments || ''}</td>
                    <td>
                      <div className="feedback-actions">
                        <button
                          className="action-button edit-button"
                          onClick={() => editFeedback(feedback)}
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          className="action-button delete-button"
                          onClick={() => deleteFeedback(feedback._id)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-feedback">
              {searchTerm ? 'No feedback matches your search criteria' : 'No feedback available'}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FeedbackList;
