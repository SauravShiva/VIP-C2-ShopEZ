const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true }, // e.g., 'AAPL'
  name: { type: String, required: true }, // e.g., 'Apple Inc.'
  price: { type: Number, required: true }, // Current price
  dailyStats: {
    high: Number,
    low: Number,
    open: Number,
    volume: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Stock', stockSchema);