import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaStar, FaSearch, FaDownload } from 'react-icons/fa';
import './FeedbackList.css';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../assets/logo.png';
// Import Chart.js components
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFeedback, setEditedFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [chartData, setChartData] = useState({
    pie: null,
    bar: null
  });

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get('http://localhost:4058/api/feedback');
        const feedbackData = response.data;
        setFeedbacks(feedbackData);
        setFilteredFeedbacks(feedbackData);
        prepareChartData(feedbackData);
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

  // Prepare chart data from feedback
  const prepareChartData = (feedbackData) => {
    if (!feedbackData || feedbackData.length === 0) {
      setChartData({
        pie: {
          labels: ['No Data'],
          datasets: [{
            data: [1],
            backgroundColor: ['#ddd']
          }]
        },
        bar: {
          labels: ['No Data'],
          datasets: [{
            label: 'Feedback Count',
            data: [0],
            backgroundColor: '#ddd'
          }]
        }
      });
      return;
    }

    // Count ratings
    const ratingCounts = {};
    for (let i = 1; i <= 5; i++) {
      ratingCounts[i] = 0;
    }
    feedbackData.forEach(feedback => {
      const rating = Math.round(feedback.rating) || 0;
      if (rating >= 1 && rating <= 5) {
        ratingCounts[rating]++;
      }
    });

    // Prepare colors
    const colors = [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4BC0C0',
      '#9966FF'
    ];

    // Prepare pie chart data
    const pieData = {
      labels: Object.keys(ratingCounts).map(rating => `${rating} Star${rating !== '1' ? 's' : ''}`),
      datasets: [{
        data: Object.values(ratingCounts),
        backgroundColor: colors,
        borderColor: colors.map(color => color.replace('0.8', '1')),
        borderWidth: 1
      }]
    };

    // Prepare bar chart data
    const barData = {
      labels: Object.keys(ratingCounts).map(rating => `${rating} Star${rating !== '1' ? 's' : ''}`),
      datasets: [{
        label: 'Number of Feedbacks',
        data: Object.values(ratingCounts),
        backgroundColor: colors[0],
        borderColor: colors[0].replace('0.8', '1'),
        borderWidth: 1
      }]
    };

    setChartData({
      pie: pieData,
      bar: barData
    });
  };

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
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = feedbacks.filter(feedback =>
      feedback.name?.toLowerCase().includes(term) ||
      feedback.email?.toLowerCase().includes(term) ||
      feedback.comments?.toLowerCase().includes(term)
    );
    setFilteredFeedbacks(filtered);
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
        
        // Fetch the updated feedback list instead of trying to update it locally
        const response = await axios.get('http://localhost:4058/api/feedback');
        const updatedFeedbacks = response.data;
        
        setFeedbacks(updatedFeedbacks);
        setFilteredFeedbacks(updatedFeedbacks);
        prepareChartData(updatedFeedbacks);
        
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
    setEditedFeedback({ ...feedback });
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
      await axios.put(`http://localhost:4058/api/feedback/${editedFeedback._id}`, editedFeedback);
      
      // Fetch the updated feedback list instead of trying to update it locally
      const response = await axios.get('http://localhost:4058/api/feedback');
      const updatedFeedbacks = response.data;
      
      setFeedbacks(updatedFeedbacks);
      setFilteredFeedbacks(updatedFeedbacks);
      prepareChartData(updatedFeedbacks);
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
    const stars = [];
    const roundedRating = Math.round(rating) || 0;
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          style={{
            color: i <= roundedRating ? '#FFD700' : '#ddd',
            fontSize: '1rem'
          }}
        />
      );
    }
    
    return <div className="rating-stars">{stars}</div>;
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

          {/* Charts Section */}
          <div className="charts-container">
            <div className="chart-wrapper">
              <h3>Rating Distribution (Pie Chart)</h3>
              {chartData.pie && (
                <div className="chart">
                  <Pie 
                    data={chartData.pie} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            padding: 20,
                            font: {
                              size: 12
                            }
                          }
                        },
                        title: {
                          display: true,
                          text: 'Feedback Rating Distribution',
                          font: {
                            size: 16,
                            weight: 'bold'
                          }
                        }
                      }
                    }}
                  />
                </div>
              )}
            </div>
            <div className="chart-wrapper">
              <h3>Rating Distribution (Bar Chart)</h3>
              {chartData.bar && (
                <div className="chart">
                  <Bar 
                    data={chartData.bar} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false
                        },
                        title: {
                          display: true,
                          text: 'Feedback Rating Distribution',
                          font: {
                            size: 16,
                            weight: 'bold'
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1,
                            font: {
                              size: 12
                            }
                          }
                        },
                        x: {
                          ticks: {
                            font: {
                              size: 12
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              )}
            </div>
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
