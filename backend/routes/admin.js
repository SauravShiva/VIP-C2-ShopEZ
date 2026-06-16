const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Transaction = require('../models/Transaction');

// GET Route: View all transactions across the entire platform
// Protected by both 'auth' and 'admin' middleware
router.get('/transactions', [auth, admin], async (req, res) => {
  try {
    // Find all transactions, and use 'populate' to pull in the names and emails 
    // of the users who made them (instead of just showing their random user IDs)
    const allTransactions = await Transaction.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 }); // Sort by newest first

    res.json(allTransactions);

  } catch (error) {
    console.error('Admin Error:', error.message);
    res.status(500).json({ message: 'Server Error fetching platform activity' });
  }
});

module.exports = router;