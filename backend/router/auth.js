const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../model/userSchema');

/**
 * Route: POST /register (and alias /signup)
 * Description: Register a new user
 */
router.post(['/register', '/signup'], async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;

  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({
      error: 'Please fill all required fields',
    });
  }

  if (password !== cpassword) {
    return res.status(422).json({
      error: 'Passwords do not match',
    });
  }

  try {
    const userExist = await User.findOne({ email: email.toLowerCase() });

    if (userExist) {
      return res.status(422).json({
        error: 'Email already exists',
      });
    }

    const user = new User({
      name,
      email: email.toLowerCase(),
      phone,
      work,
      password,
      cpassword,
    });

    await user.save();

    return res.status(201).json({
      message: 'User registered successfully',
    });
  } catch (err) {
    console.error('[Registration Error]:', err);
    return res.status(500).json({
      error: 'Internal server error while registering user',
      details: err.message,
    });
  }
});

/**
 * Route: POST /signin (and alias /login)
 * Description: Authenticate and sign in user
 */
router.post(['/signin', '/login'], async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Invalid Credentials',
    });
  }

  try {
    const userLogin = await User.findOne({ email: email.toLowerCase() });

    if (!userLogin) {
      return res.status(400).json({
        error: 'Invalid Credentials',
      });
    }

    const isMatch = await bcrypt.compare(password, userLogin.password);

    if (!isMatch) {
      return res.status(400).json({
        error: 'Invalid Credentials',
      });
    }

    const token = await userLogin.generateAuthToken();

    res.cookie('jwtoken', token, {
      expires: new Date(Date.now() + 25892000000), // 30 days
      httpOnly: true,
    });

    return res.status(200).json({
      message: 'User Signin Successfully',
      token,
      user: {
        _id: userLogin._id,
        name: userLogin.name,
        email: userLogin.email,
        phone: userLogin.phone,
        work: userLogin.work,
      },
    });
  } catch (err) {
    console.error('[Signin Error]:', err);
    return res.status(500).json({
      error: 'Internal server error during sign in',
      details: err.message,
    });
  }
});

/**
 * Route: GET /profile/:id
 * Description: Retrieve user profile by user ID or email
 */
router.get('/profile/:id', async (req, res) => {
  const { id } = req.params;

  try {
    let user;
    if (id.includes('@')) {
      user = await User.findOne({ email: id.toLowerCase() }).select('-password -cpassword');
    } else {
      user = await User.findById(id).select('-password -cpassword');
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error('[Profile Error]:', err);
    return res.status(500).json({
      error: 'Failed to retrieve profile',
      details: err.message,
    });
  }
});

/**
 * Route: GET /about
 * Description: About service / status check
 */
router.get('/about', (req, res) => {
  res.status(200).json({
    project: 'CodeCraft',
    version: '1.0.0',
    author: 'Sneha Prajapati',
    status: 'Operational',
  });
});

module.exports = router;
