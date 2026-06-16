const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true 
  },
  balance: { type: Number, default: 100000 }, // Default starting cash for paper trading
  holdings: [{
    stockSymbol: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    averageBuyPrice: { type: Number, required: true }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);