const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // For password encryption
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Your database model

// POST Route: Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if the user already exists in the database
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Encrypt (hash) the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create and save the new user
    user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully!' });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// POST Route: Login an existing user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if the user actually exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // 2. Compare the typed password with the encrypted password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // 3. Create the JWT (The digital key card)
    // We attach the user's ID and Role to the token so the frontend knows who is logged in
    const payload = {
      id: user._id,
      role: user.role
    };

    // Sign the token using your secret key from the .env file
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

    // Send the token and user data back to the frontend
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;