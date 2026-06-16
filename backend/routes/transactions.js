const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // 👉 Your security checkpoint
const Transaction = require('../models/Transaction');
const Portfolio = require('../models/Portfolio');

// POST Route: Buy a stock
// Notice 'auth' sits right between the URL and the logic!
router.post('/buy', auth, async (req, res) => {
  try {
    const { stockSymbol, quantity, price } = req.body;
    const userId = req.user.id; // We get this safely from the JWT token
    const totalCost = quantity * price;

    // 1. Find the user's portfolio (or create one with $100k if it's their first time)
    let portfolio = await Portfolio.findOne({ user: userId });
    if (!portfolio) {
      portfolio = new Portfolio({ user: userId, balance: 100000, holdings: [] });
    }

    // 2. Check if they have enough cash
    if (portfolio.balance < totalCost) {
      return res.status(400).json({ message: 'Insufficient funds in virtual wallet' });
    }

    // 3. Deduct the cash from their balance
    portfolio.balance -= totalCost;

    // 4. Update their stock holdings
    const holdingIndex = portfolio.holdings.findIndex(h => h.stockSymbol === stockSymbol);
    if (holdingIndex > -1) {
      // They already own this stock, just add more shares
      portfolio.holdings[holdingIndex].quantity += quantity;
    } else {
      // First time buying this specific stock
      portfolio.holdings.push({ stockSymbol, quantity, averageBuyPrice: price });
    }
    await portfolio.save();

    // 5. Create a permanent receipt in the Transactions database
    const transaction = new Transaction({
      user: userId,
      stockSymbol,
      tradeType: 'BUY',
      quantity,
      price
    });
    await transaction.save();

    // Send a success message back to the frontend
    res.json({ message: `Successfully purchased ${quantity} shares of ${stockSymbol}!`, portfolio });

  } catch (error) {
    console.error('Trade Error:', error.message);
    res.status(500).json({ message: 'Server Error during transaction' });
  }
});

// POST Route: Sell a stock
router.post('/sell', auth, async (req, res) => {
  try {
    const { stockSymbol, quantity, price } = req.body;
    const userId = req.user.id;
    const totalRevenue = quantity * price; // Money you get back

    // 1. Find the user's portfolio
    let portfolio = await Portfolio.findOne({ user: userId });
    if (!portfolio) {
      return res.status(400).json({ message: 'Portfolio not found. Buy stocks first!' });
    }

    // 2. Check if they actually own the stock and have enough shares to sell
    const holdingIndex = portfolio.holdings.findIndex(h => h.stockSymbol === stockSymbol);
    
    if (holdingIndex === -1 || portfolio.holdings[holdingIndex].quantity < quantity) {
      return res.status(400).json({ message: 'Not enough shares to sell' });
    }

    // 3. Deduct the shares and add the cash back to their balance
    portfolio.holdings[holdingIndex].quantity -= quantity;
    portfolio.balance += totalRevenue;

    // 4. Clean up: if they sold all their shares, remove the stock from the list completely
    if (portfolio.holdings[holdingIndex].quantity === 0) {
      portfolio.holdings.splice(holdingIndex, 1);
    }

    await portfolio.save();

    // 5. Create a permanent receipt
    const transaction = new Transaction({
      user: userId,
      stockSymbol,
      tradeType: 'SELL',
      quantity,
      price
    });
    await transaction.save();

    res.json({ message: `Successfully sold ${quantity} shares of ${stockSymbol}!`, portfolio });

  } catch (error) {
    console.error('Trade Error:', error.message);
    res.status(500).json({ message: 'Server Error during transaction' });
  }
});

module.exports = router;