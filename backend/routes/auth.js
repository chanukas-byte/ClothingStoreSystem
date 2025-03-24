/*******************************************************
 * routes/auth.js
 *******************************************************/
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const secret = process.env.JWT_SECRET || 'defaultSecretKey';

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (example with extra fields)
 * @access  Public
 */
router.post('/register', async (req, res) => {
  console.log('Request body (register):', req.body);

  const {
    name,
    email,
    password,
    gender,
    dateOfBirth,
    mobileNumber,
    address
  } = req.body;

  // Basic validation
  if (
    !name ||
    !email ||
    !password ||
    !gender ||
    !dateOfBirth ||
    !mobileNumber ||
    !address
  ) {
    return res.status(400).json({
      msg: 'Please include name, email, password, gender, dateOfBirth, mobileNumber, and address'
    });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user (role = customer by default)
    user = new User({
      name,
      email,
      password,
      gender,
      dateOfBirth,
      mobileNumber,
      address,
      role: 'customer'
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save to DB
    await user.save();

    return res.status(200).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error('Error in /api/auth/register:', err);
    return res.status(500).send('Server error');
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return JWT
 * @access  Public
 */
router.post('/login', async (req, res) => {
  console.log('Request body (login):', req.body);

  const { email, password } = req.body;

  // Basic field check
  if (!email || !password) {
    return res.status(400).json({ msg: 'Please include email and password' });
  }

  try {
    // 1) Check if user exists
    const user = await User.findOne({ email });
    console.log('Found user:', user);

    if (!user) {
      // If no user is found with that email
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 2) Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      // If the password is incorrect
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 3) Create JWT payload
    const payload = { user: { id: user._id, role: user.role } };

    // 4) Sign and return token
    jwt.sign(payload, secret, { expiresIn: '1d' }, (err, token) => {
      if (err) throw err;
      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    });
  } catch (err) {
    console.error('Error in /api/auth/login:', err);
    return res.status(500).send('Server error');
  }
});

module.exports = router;
