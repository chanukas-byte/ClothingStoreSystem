// src/components/UserManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const token = localStorage.getItem('token');

  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    gender: 'Male',
    dateOfBirth: '',
    mobileNumber: '',
    address: ''
  });
  
  // Validation errors state
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    dateOfBirth: '',
    mobileNumber: '',
    address: ''
  });
  
  // Track which fields have been touched
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    dateOfBirth: false,
    mobileNumber: false,
    address: false
  });
  
  const [editId, setEditId] = useState(null);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [filterRole, setFilterRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setFormError('');
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: { 'x-auth-token': token }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.msg || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Calculate max date (18 years ago) for date of birth
  const getMaxDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    return date.toISOString().split('T')[0];
  };

  // Validation functions for each field
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
  
  const validateEmail = (email) => {
    if (!email.trim()) {
      return 'Email is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };
  
  const validatePassword = (password, isRequired = true) => {
    if (!password && isRequired) {
      return 'Password is required';
    } else if (password && password.length < 6) {
      return 'Password must be at least 6 characters';
    } else if (password && password.length > 50) {
      return 'Password must be less than 50 characters';
    } else if (password && !/\d/.test(password)) {
      return 'Password must include at least one number';
    } else if (password && !/[a-zA-Z]/.test(password)) {
      return 'Password must include at least one letter';
    }
    return '';
  };
  
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
      return 'User must be at least 18 years old';
    } else if (dobDate < minDate) {
      return 'Please enter a valid date of birth';
    }
    
    return '';
  };
  
  const validateMobileNumber = (mobile) => {
    if (!mobile) {
      return 'Mobile number is required';
    } else if (!/^\d{10,15}$/.test(mobile.replace(/[-()\s]/g, ''))) {
      return 'Please enter a valid mobile number (10-15 digits)';
    }
    return '';
  };
  
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
        return validatePassword(value, !editId);
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
  
  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Validate each field
    Object.keys(form).forEach(field => {
      // Skip password validation for edit mode
      if (field === 'password' && editId) return;
      
      // Skip role and gender as they have default values
      if (field === 'role' || field === 'gender') return;
      
      const error = validateField(field, form[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      } else {
        newErrors[field] = '';
      }
    });
    
    setErrors(newErrors);
    
    // Mark all fields as touched
    const newTouched = {};
    Object.keys(form).forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);
    
    return isValid;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
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

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      password: '',
      role: 'employee',
      gender: 'Male',
      dateOfBirth: '',
      mobileNumber: '',
      address: ''
    });
    setErrors({
      name: '',
      email: '',
      password: '',
      dateOfBirth: '',
      mobileNumber: '',
      address: ''
    });
    setTouched({
      name: false,
      email: false,
      password: false,
      dateOfBirth: false,
      mobileNumber: false,
      address: false
    });
    setEditId(null);
    setFormError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    if (!validateForm()) {
      setFormError('Please fix the errors in the form before submitting.');
      return;
    }
    
    setFormError('');
    setSuccess('');
    setLoading(true);

    try {
      if (editId) {
        // Update user (PUT)
        await axios.put(
          `http://localhost:5000/api/users/${editId}`,
          {
            name: form.name,
            email: form.email,
            role: form.role,
            gender: form.gender,
            dateOfBirth: form.dateOfBirth,
            mobileNumber: form.mobileNumber,
            address: form.address
          },
          { headers: { 'x-auth-token': token } }
        );
        setSuccess('User updated successfully');
        setEditId(null);
      } else {
        // Create new user (POST)
        await axios.post(
          'http://localhost:5000/api/users',
          form,
          { headers: { 'x-auth-token': token } }
        );
        setSuccess('User created successfully');
      }
      // Reset form and refresh user list
      resetForm();
      fetchUsers();
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.msg || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (user) => {
    setEditId(user._id);
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : '',
      mobileNumber: user.mobileNumber,
      address: user.address
    });
    
    // Reset errors and touched states
    setErrors({
      name: '',
      email: '',
      password: '',
      dateOfBirth: '',
      mobileNumber: '',
      address: ''
    });
    setTouched({
      name: false,
      email: false,
      password: false,
      dateOfBirth: false,
      mobileNumber: false,
      address: false
    });
    
    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const onDelete = async (id, userName) => {
    // Confirm before delete
    if (!window.confirm(`Are you sure you want to delete ${userName}?`)) {
      return;
    }
    
    try {
      setFormError('');
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setSuccess('User deleted successfully');
      fetchUsers();
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.msg || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    resetForm();
    setFormError('');
    setSuccess('');
  };

  // Filter and search users
  const filteredUsers = users.filter(user => {
    const roleMatch = filterRole === 'all' || user.role === filterRole;
    const searchMatch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return roleMatch && searchMatch;
  });

  // Sort users by role
  const adminEmployees = filteredUsers.filter(u => u.role === 'admin' || u.role === 'employee');
  const customers = filteredUsers.filter(u => u.role === 'customer');

  // Check if form has any errors
  const hasErrors = Object.values(errors).some(error => error !== '');

  return (
    <div className="user-management animate__animated animate__fadeIn" data-aos="fade-up">
      <div className="section-header">
        <h1>User Management</h1>
        <p>Create, update and manage user accounts</p>
      </div>
      
      {formError && (
        <div className="alert alert-error" data-aos="fade-in">
          <i className="fas fa-exclamation-circle"></i> {formError}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success" data-aos="fade-in">
          <i className="fas fa-check-circle"></i> {success}
        </div>
      )}

      {/* User Form */}
      <div className="user-form-card" data-aos="fade-up">
        <div className="card-header">
          <h2>{editId ? 'Edit User' : 'Add New User'}</h2>
        </div>
        <div className="card-body">
          <form onSubmit={onSubmit} noValidate>
            <div className="form-group">
              <div className={`form-control ${errors.name && touched.name ? 'has-error' : ''}`}>
                <label htmlFor="name">
                  <i className="fas fa-user"></i> Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  onBlur={handleBlur}
                  className={errors.name && touched.name ? 'input-error' : ''}
                  placeholder="Enter full name"
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
                  value={form.email}
                  onChange={onChange}
                  onBlur={handleBlur}
                  className={errors.email && touched.email ? 'input-error' : ''}
                  placeholder="Enter email address"
                  required
                />
                {errors.email && touched.email && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i> {errors.email}
                  </div>
                )}
              </div>
            </div>
            
            {/* Password field only for new user */}
            {!editId && (
              <div className={`form-control ${errors.password && touched.password ? 'has-error' : ''}`}>
                <label htmlFor="password">
                  <i className="fas fa-lock"></i> Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  onBlur={handleBlur}
                  className={errors.password && touched.password ? 'input-error' : ''}
                  placeholder="Create a password"
                  required={!editId}
                />
                {errors.password && touched.password && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i> {errors.password}
                  </div>
                )}
              </div>
            )}
            
            <div className="form-group">
              <div className="form-control">
                <label htmlFor="role">
                  <i className="fas fa-user-tag"></i> Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={onChange}
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="employee">Employee</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
              
              <div className="form-control">
                <label htmlFor="gender">
                  <i className="fas fa-venus-mars"></i> Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={form.gender}
                  onChange={onChange}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <div className={`form-control ${errors.dateOfBirth && touched.dateOfBirth ? 'has-error' : ''}`}>
                <label htmlFor="dateOfBirth">
                  <i className="fas fa-calendar-alt"></i> Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  max={getMaxDate()}
                  value={form.dateOfBirth}
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
                  value={form.mobileNumber}
                  onChange={onChange}
                  onBlur={handleBlur}
                  className={errors.mobileNumber && touched.mobileNumber ? 'input-error' : ''}
                  placeholder="Enter mobile number"
                  required
                />
                {errors.mobileNumber && touched.mobileNumber && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i> {errors.mobileNumber}
                  </div>
                )}
              </div>
            </div>
            
            <div className={`form-control ${errors.address && touched.address ? 'has-error' : ''}`}>
              <label htmlFor="address">
                <i className="fas fa-map-marker-alt"></i> Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={form.address}
                onChange={onChange}
                onBlur={handleBlur}
                className={errors.address && touched.address ? 'input-error' : ''}
                placeholder="Enter address"
                required
              />
              {errors.address && touched.address && (
                <div className="error-message">
                  <i className="fas fa-exclamation-circle"></i> {errors.address}
                </div>
              )}
            </div>
            
            <div className="form-buttons">
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={onCancel}
              >
                <i className="fas fa-times"></i> Cancel
              </button>
              <button 
                type="submit" 
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                disabled={loading || hasErrors}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> {editId ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <i className={`fas ${editId ? 'fa-save' : 'fa-plus'}`}></i> {editId ? 'Update User' : 'Add User'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* User Listing */}
      <div className="user-list-section" data-aos="fade-up">
        <div className="list-header">
          <h2>All Users</h2>
          <div className="list-actions">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="role-filter"
              value={filterRole}
              onChange={e => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
              <option value="customer">Customer</option>
            </select>
          </div>
        </div>

        {loading && users.length === 0 ? (
          <div className="loading-indicator">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading users...</p>
          </div>
        ) : (
          <>
            {/* Admin & Employee Table */}
            {adminEmployees.length > 0 && (
              <div className="user-table-container" data-aos="fade-up">
                <h3>
                  <i className="fas fa-user-tie"></i> Admins & Employees
                </h3>
                <div className="table-responsive">
                  <table className="table user-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Gender</th>
                        <th>Contact</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminEmployees.map(user => (
                        <tr key={user._id}>
                          <td className="user-name-cell">
                            <span className="user-avatar">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                            <span>{user.name}</span>
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`role-badge ${user.role}`}>
                              {user.role}
                            </span>
                          </td>
                          <td>{user.gender}</td>
                          <td>{user.mobileNumber}</td>
                          <td className="action-cell">
                            <button 
                              className="btn btn-sm btn-edit" 
                              onClick={() => onEdit(user)}
                              title="Edit User"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-danger" 
                              onClick={() => onDelete(user._id, user.name)}
                              title="Delete User"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Customer Table */}
            {customers.length > 0 && (
              <div className="user-table-container" data-aos="fade-up">
                <h3>
                  <i className="fas fa-users"></i> Customers
                </h3>
                <div className="table-responsive">
                  <table className="table user-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Gender</th>
                        <th>Contact</th>
                        <th>Address</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map(user => (
                        <tr key={user._id}>
                          <td className="user-name-cell">
                            <span className="user-avatar">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                            <span>{user.name}</span>
                          </td>
                          <td>{user.email}</td>
                          <td>{user.gender}</td>
                          <td>{user.mobileNumber}</td>
                          <td>{user.address}</td>
                          <td className="action-cell">
                            <button 
                              className="btn btn-sm btn-edit" 
                              onClick={() => onEdit(user)}
                              title="Edit User"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-danger" 
                              onClick={() => onDelete(user._id, user.name)}
                              title="Delete User"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {filteredUsers.length === 0 && (
              <div className="no-users-message">
                <i className="fas fa-users-slash"></i>
                <p>No users found. Adjust your search or add a new user.</p>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        .section-header {
          margin-bottom: 1.5rem;
        }
        
        .section-header h1 {
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
          color: #333;
        }
        
        .section-header p {
          color: #666;
        }
        
        .user-form-card {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          margin-bottom: 2rem;
          overflow: hidden;
        }
        
        .card-header {
          background-color: #333;
          color: white;
          padding: 1rem 1.5rem;
        }
        
        .card-header h2 {
          margin: 0;
          font-size: 1.2rem;
        }
        
        .card-body {
          padding: 1.5rem;
        }
        
        .form-control {
          margin-bottom: 1.5rem;
          position: relative;
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
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        
        .btn-sm {
          padding: 0.4rem 0.6rem;
          font-size: 0.8rem;
        }
        
        .btn-edit {
          background-color: #455a64;
        }
        
        .btn-danger {
          background-color: #e53935;
        }
        
        .user-list-section {
          margin-top: 2rem;
        }
        
        .list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .list-header h2 {
          margin: 0;
          font-size: 1.5rem;
        }
        
        .list-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        
        .search-box {
          position: relative;
        }
        
        .search-box i {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #666;
        }
        
        .search-box input {
          padding: 0.5rem 0.5rem 0.5rem 2rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          width: 220px;
        }
        
        .role-filter {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        .user-table-container {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          margin-bottom: 2rem;
          padding: 1.5rem;
        }
        
        .user-table-container h3 {
          margin-top: 0;
          margin-bottom: 1rem;
          font-size: 1.2rem;
          color: #333;
          display: flex;
          align-items: center;
        }
        
        .user-table-container h3 i {
          margin-right: 0.5rem;
        }
        
        .table-responsive {
          overflow-x: auto;
        }
        
        .user-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .user-table th,
        .user-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        
        .user-table th {
          font-weight: 600;
          color: #333;
          background-color: #f5f5f5;
        }
        
        .user-table tr:hover {
          background-color: #fafafa;
        }
        
        .user-name-cell {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }
        
        .user-avatar {
          width: 32px;
          height: 32px;
          background-color: #333;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }
        
        .role-badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: capitalize;
        }
        
        .role-badge.admin {
          background-color: rgba(33, 150, 243, 0.1);
          color: #2196f3;
        }
        
        .role-badge.employee {
          background-color: rgba(76, 175, 80, 0.1);
          color: #4caf50;
        }
        
        .role-badge.customer {
          background-color: rgba(156, 39, 176, 0.1);
          color: #9c27b0;
        }
        
        .action-cell {
          display: flex;
          gap: 0.5rem;
        }
        
        .loading-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .loading-indicator i {
          font-size: 2rem;
          color: #333;
          margin-bottom: 1rem;
        }
        
        .no-users-message {
          text-align: center;
          padding: 3rem;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .no-users-message i {
          font-size: 3rem;
          color: #ddd;
          margin-bottom: 1rem;
        }
        
        .no-users-message p {
          color: #666;
        }
        
        /* Button Styles */
        button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        
        /* Animation for validation errors */
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .input-error {
          animation: shake 0.5s;
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
        
        @media (max-width: 768px) {
          .list-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .list-actions {
            width: 100%;
            flex-direction: column;
            align-items: flex-start;
          }
          
          .search-box, .search-box input, .role-filter {
            width: 100%;
          }
          
          .action-cell {
            flex-direction: column;
          }
          
          .form-group {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default UserManagement;