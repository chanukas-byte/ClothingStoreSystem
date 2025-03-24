// src/components/AdminDashboard.js
import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import UserManagement from './UserManagement';
import Chatbot from "../components/Chatbot";

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in and is admin
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'admin') {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="admin-layout">
      <AdminNavbar />
      <Chatbot />
      <main className="admin-content">
        <Routes>
          <Route
            path="/"
            element={<DashboardHome />}
          />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/inventory" element={<ComingSoon title="Inventory Management" />} />
          <Route path="/orders" element={<ComingSoon title="Order Management" />} />
          <Route path="/reports" element={<ComingSoon title="Reports" />} />
          <Route path="/profile" element={<ComingSoon title="Admin Profile" />} />
          <Route path="/settings" element={<ComingSoon title="Settings" />} />
        </Routes>
      </main>
      
      <style jsx>{`
        .admin-layout {
          min-height: 100vh;
          background-color: #f5f5f5;
          display: flex;
          flex-direction: column;
        }
        
        .admin-content {
          flex: 1;
          padding: 2rem;
        }
        
        @media (max-width: 768px) {
          .admin-content {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

// Dashboard Home Component
const DashboardHome = () => {
  return (
    <div className="dashboard-home animate__animated animate__fadeIn" data-aos="fade-up">
      <div className="dashboard-welcome">
        <h1>Welcome to LiveArt Admin Dashboard</h1>
        <p>Manage your clothing store with powerful tools and analytics</p>
        
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card" data-aos="fade-up" data-aos-delay="100">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p>246</p>
            <span className="stat-change positive">
              <i className="fas fa-arrow-up"></i> 12% from last month
            </span>
          </div>
        </div>
        
        <div className="stat-card" data-aos="fade-up" data-aos-delay="200">
          <div className="stat-icon">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <div className="stat-content">
            <h3>Total Orders</h3>
            <p>184</p>
            <span className="stat-change positive">
              <i className="fas fa-arrow-up"></i> 8% from last month
            </span>
          </div>
        </div>
        
        <div className="stat-card" data-aos="fade-up" data-aos-delay="300">
          <div className="stat-icon">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-content">
            <h3>Revenue</h3>
            <p>$12,486</p>
            <span className="stat-change positive">
              <i className="fas fa-arrow-up"></i> 15% from last month
            </span>
          </div>
        </div>
        
        <div className="stat-card" data-aos="fade-up" data-aos-delay="400">
          <div className="stat-icon">
            <i className="fas fa-box"></i>
          </div>
          <div className="stat-content">
            <h3>Products</h3>
            <p>126</p>
            <span className="stat-change negative">
              <i className="fas fa-arrow-down"></i> 4% from last month
            </span>
          </div>
        </div>
      </div>
      
      <div className="dashboard-sections">
        <div className="dashboard-section" data-aos="fade-up" data-aos-delay="100">
          <div className="section-header">
            <h2>Recent Orders</h2>
            <button className="btn btn-outline">View All</button>
          </div>
          <div className="section-content">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#ORD-5462</td>
                  <td>John Smith</td>
                  <td>Mar 15, 2025</td>
                  <td>$124.00</td>
                  <td><span className="status-badge delivered">Delivered</span></td>
                </tr>
                <tr>
                  <td>#ORD-5461</td>
                  <td>Mary Johnson</td>
                  <td>Mar 14, 2025</td>
                  <td>$86.50</td>
                  <td><span className="status-badge shipped">Shipped</span></td>
                </tr>
                <tr>
                  <td>#ORD-5460</td>
                  <td>Robert Wilson</td>
                  <td>Mar 13, 2025</td>
                  <td>$212.75</td>
                  <td><span className="status-badge processing">Processing</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="dashboard-section" data-aos="fade-up" data-aos-delay="200">
          <div className="section-header">
            <h2>Low Stock Products</h2>
            <button className="btn btn-outline">View All</button>
          </div>
          <div className="section-content">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Graphic T-shirt</td>
                  <td>T-shirts</td>
                  <td>$24.99</td>
                  <td><span className="stock-badge low">3 pcs</span></td>
                </tr>
                <tr>
                  <td>Slim Fit Jeans</td>
                  <td>Pants</td>
                  <td>$59.99</td>
                  <td><span className="stock-badge low">5 pcs</span></td>
                </tr>
                <tr>
                  <td>Cotton Hoodie</td>
                  <td>Sweatshirts</td>
                  <td>$44.99</td>
                  <td><span className="stock-badge low">7 pcs</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .dashboard-welcome {
          margin-bottom: 2rem;
        }
        
        .dashboard-welcome h1 {
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
          color: #333;
        }
        
        .dashboard-welcome p {
          color: #666;
          font-size: 1.1rem;
        }
        
        .dashboard-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .stat-card {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          padding: 1.5rem;
          display: flex;
          align-items: center;
          transition: all 0.3s ease;
        }
        
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
        }
        
        .stat-icon {
          width: 48px;
          height: 48px;
          background-color: rgba(0, 0, 0, 0.05);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
          font-size: 1.5rem;
          color: #333;
        }
        
        .stat-content h3 {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0.3rem;
          font-weight: 500;
        }
        
        .stat-content p {
          font-size: 1.8rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 0.3rem;
        }
        
        .stat-change {
          font-size: 0.8rem;
          display: flex;
          align-items: center;
        }
        
        .stat-change i {
          margin-right: 0.3rem;
        }
        
        .positive {
          color: #4caf50;
        }
        
        .negative {
          color: #f44336;
        }
        
        .dashboard-sections {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 1.5rem;
        }
        
        .dashboard-section {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }
        
        .section-header {
          padding: 1.2rem 1.5rem;
          border-bottom: 1px solid #eee;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .section-header h2 {
          font-size: 1.2rem;
          margin-bottom: 0;
          color: #333;
        }
        
        .section-content {
          padding: 1.5rem;
        }
        
        .section-content .table {
          margin-top: 0;
        }
        
        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .delivered {
          background-color: rgba(76, 175, 80, 0.1);
          color: #4caf50;
        }
        
        .shipped {
          background-color: rgba(33, 150, 243, 0.1);
          color: #2196f3;
        }
        
        .processing {
          background-color: rgba(255, 152, 0, 0.1);
          color: #ff9800;
        }
        
        .stock-badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .low {
          background-color: rgba(244, 67, 54, 0.1);
          color: #f44336;
        }
        
        @media (max-width: 768px) {
          .dashboard-sections {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

// Coming Soon Component for placeholder routes
const ComingSoon = ({ title }) => {
  return (
    <div className="coming-soon-container animate__animated animate__fadeIn" data-aos="fade-up">
      <div className="coming-soon-content">
        <i className="fas fa-rocket fa-4x"></i>
        <h2>{title}</h2>
        <p>This feature is coming soon. We're working hard to bring you the best experience.</p>
        <button className="btn btn-primary">Go to Dashboard</button>
      </div>
      
      <style jsx>{`
        .coming-soon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          text-align: center;
        }
        
        .coming-soon-content {
          max-width: 600px;
          padding: 3rem;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .coming-soon-content i {
          color: #333;
          margin-bottom: 1.5rem;
        }
        
        .coming-soon-content h2 {
          margin-bottom: 1rem;
          color: #333;
        }
        
        .coming-soon-content p {
          color: #666;
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;