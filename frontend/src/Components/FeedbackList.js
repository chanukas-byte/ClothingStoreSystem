import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaStar, FaSearch, FaDownload, FaUser, FaEnvelope, FaComment, FaChartBar, FaChartPie, FaFilter } from 'react-icons/fa';
import './FeedbackList.css';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../assets/logo.png';
// Import Chart.js components
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFeedback, setEditedFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [chartData, setChartData] = useState({
    barData: null,
    pieData: null
  });
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'charts'
  const [filterRating, setFilterRating] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [stats, setStats] = useState({
    total: 0,
    average: 0,
    fiveStar: 0,
    oneStar: 0
  });

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get('http://localhost:4058/api/feedback');
        const feedbackData = response.data;
        setFeedbacks(feedbackData);
        setFilteredFeedbacks(feedbackData);
        prepareChartData(feedbackData);
        calculateStats(feedbackData);
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

  useEffect(() => {
    // Filter and sort feedbacks
    let result = [...feedbacks];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(feedback => 
        feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.comments.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply rating filter
    if (filterRating > 0) {
      result = result.filter(feedback => feedback.rating === filterRating);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'highest':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        result.sort((a, b) => a.rating - b.rating);
        break;
      default:
        break;
    }
    
    setFilteredFeedbacks(result);
  }, [feedbacks, searchTerm, filterRating, sortBy]);

  useEffect(() => {
    // Calculate statistics
    if (feedbacks.length > 0) {
      const total = feedbacks.length;
      const sum = feedbacks.reduce((acc, curr) => acc + curr.rating, 0);
      const average = sum / total;
      const fiveStar = feedbacks.filter(f => f.rating === 5).length;
      const oneStar = feedbacks.filter(f => f.rating === 1).length;
      
      setStats({
        total,
        average: average.toFixed(1),
        fiveStar,
        oneStar
      });
    }
  }, [feedbacks]);

  // Prepare chart data from feedback
  const prepareChartData = (feedbackData) => {
    // Prepare data for rating distribution
    const ratingCounts = Array(5).fill(0);
    feedbackData.forEach(feedback => {
      if (feedback.rating >= 1 && feedback.rating <= 5) {
        ratingCounts[feedback.rating - 1]++;
      }
    });

    // Bar chart data
    const barData = {
      labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
      datasets: [
        {
          label: 'Number of Ratings',
          data: ratingCounts,
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(255, 205, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(54, 162, 235, 0.8)',
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
          ],
          borderWidth: 1,
        },
      ],
    };

    // Pie chart data
    const pieData = {
      labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
      datasets: [
        {
          data: ratingCounts,
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(255, 205, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(54, 162, 235, 0.8)',
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
          ],
          borderWidth: 1,
        },
      ],
    };

    setChartData({ barData, pieData });
  };

  const calculateStats = (feedbackData) => {
    // Calculate statistics
    if (feedbackData.length > 0) {
      const total = feedbackData.length;
      const sum = feedbackData.reduce((acc, curr) => acc + curr.rating, 0);
      const average = sum / total;
      const fiveStar = feedbackData.filter(f => f.rating === 5).length;
      const oneStar = feedbackData.filter(f => f.rating === 1).length;
      
      setStats({
        total,
        average: average.toFixed(1),
        fiveStar,
        oneStar
      });
    }
  };

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
        calculateStats(updatedFeedbacks);
        
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

  const handleFilterChange = (e) => {
    setFilterRating(parseInt(e.target.value));
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const downloadCSV = () => {
    const headers = ['Name', 'Email', 'Rating', 'Comments', 'Date'];
    const csvData = filteredFeedbacks.map(feedback => [
      feedback.name,
      feedback.email,
      feedback.rating,
      feedback.comments,
      new Date(feedback.createdAt).toLocaleDateString()
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'feedback_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Rating Distribution',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
  };

  return (
    <div className="feedback-list-container">
      <div className="feedback-list-header">
        <h2>Customer Feedback</h2>
        <div className="tab-buttons">
          <button
            className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            <FaComment /> List View
          </button>
          <button
            className={`tab-button ${activeTab === 'charts' ? 'active' : ''}`}
            onClick={() => setActiveTab('charts')}
          >
            <FaChartBar /> Charts
          </button>
        </div>
      </div>

      {activeTab === 'list' ? (
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
            <div className="filter-container">
              <FaFilter className="filter-icon" />
              <select 
                value={filterRating} 
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value={0}>All Ratings</option>
                <option value={5}>5 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={2}>2 Stars</option>
                <option value={1}>1 Star</option>
              </select>
            </div>
            <div className="sort-container">
              <select 
                value={sortBy} 
                onChange={handleSortChange}
                className="sort-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>
            <button className="download-button" onClick={downloadPDF}>
              <FaDownload /> Export PDF
            </button>
          </div>
          
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Feedback</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.average}</div>
              <div className="stat-label">Average Rating</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.fiveStar}</div>
              <div className="stat-label">5 Star Reviews</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.oneStar}</div>
              <div className="stat-label">1 Star Reviews</div>
            </div>
          </div>
          
          <div className="feedback-grid">
            {filteredFeedbacks.length > 0 ? (
              filteredFeedbacks.map((feedback) => (
                <div key={feedback._id} className="feedback-card">
                  <div className="feedback-header">
                    <div className="user-info">
                      <FaUser className="user-icon" />
                      <span>{feedback.name}</span>
                    </div>
                    <div className="rating">
                      {[...Array(5)].map((_, index) => (
                        <FaStar
                          key={index}
                          className={`star ${index < feedback.rating ? 'active' : ''}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="feedback-content">
                    <p className="comment">{feedback.comments}</p>
                    <div className="email">
                      <FaEnvelope />
                      <span>{feedback.email}</span>
                    </div>
                    <div className="date">
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    className="delete-button"
                    onClick={() => deleteFeedback(feedback._id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              ))
            ) : (
              <div className="no-results">
                No feedback found matching your criteria
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="charts-container">
          <div className="chart-card">
            <h3>Rating Distribution (Bar Chart)</h3>
            {chartData.barData && <Bar data={chartData.barData} options={chartOptions} />}
          </div>
          <div className="chart-card">
            <h3>Rating Distribution (Pie Chart)</h3>
            {chartData.pieData && <Pie data={chartData.pieData} options={chartOptions} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackList;
