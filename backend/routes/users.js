/*******************************************************
 * routes/users.js
 *******************************************************/
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// Middleware to allow only admins
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied: Admins only' });
  }
  next();
};

/**
 * @route   GET /api/users
 * @desc    Get all users (Admin only)
 * @access  Private
 */
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

/**
 * @route   POST /api/users
 * @desc    Create a new user (Admin can create admin/employee/customer)
 * @access  Private
 */
router.post('/', auth, adminOnly, async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    gender,
    dateOfBirth,
    mobileNumber,
    address
  } = req.body;

  // Basic checks
  if (
    !name ||
    !email ||
    !password ||
    !role ||
    !gender ||
    !dateOfBirth ||
    !mobileNumber ||
    !address
  ) {
    return res.status(400).json({
      msg: 'Please include name, email, password, role, gender, dateOfBirth, mobileNumber, and address'
    });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
      role,
      gender,
      dateOfBirth,
      mobileNumber,
      address
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    return res.status(201).json({ msg: 'User created successfully', user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

/**
 * @route   PUT /api/users/:id
 * @desc    Update user details (Admin only)
 * @access  Private
 */
router.put('/:id', auth, adminOnly, async (req, res) => {
  const { name, email, role, gender, dateOfBirth, mobileNumber, address } = req.body;

  // No password update here—handle separately if needed

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        role,
        gender,
        dateOfBirth,
        mobileNumber,
        address
      },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }
    return res.json({ msg: 'User updated successfully', user: updatedUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a user (Admin only)
 * @access  Private
 */
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    // Use findByIdAndDelete instead of findByIdAndRemove (deprecated in newer Mongoose versions)
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }
    return res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
