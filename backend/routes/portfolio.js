const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Portfolio = require('../models/Portfolio');

// GET Route: Fetch the logged-in user's portfolio
router.get('/', auth, async (req, res) => {
  try {
    // req.user.id comes directly from your secure JWT token
    const portfolio = await Portfolio.findOne({ user: req.user.id });

    if (!portfolio) {
      return res.status(404).json({ message: 'No portfolio found. Make a trade to start!' });
    }

    // Send the current balance and all stock holdings back to the user
    res.json(portfolio);

  } catch (error) {
    console.error('Portfolio Error:', error.message);
    res.status(500).json({ message: 'Server Error fetching portfolio' });
  }
});

module.exports = router;