const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Links this transaction to the User model
    required: true 
  },
  stockSymbol: { type: String, required: true },
  tradeType: { 
    type: String, 
    enum: ['BUY', 'SELL'], 
    required: true 
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true } // Price at the exact time of the trade
}, { timestamps: true }); // Automatically handles the 'timestamp' requirement

module.exports = mongoose.model('Transaction', transactionSchema);