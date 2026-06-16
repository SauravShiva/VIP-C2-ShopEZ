const express = require('express');
const router = express.Router();
const axios = require('axios'); // Tool used to make external API calls

// GET Route: Fetch real-time stock data by symbol
// The ":symbol" in the URL acts as a variable we can read
router.get('/:symbol', async (req, res) => {
  try {
    // 1. Grab the symbol from the URL and make it uppercase (e.g., 'aapl' -> 'AAPL')
    const symbol = req.params.symbol.toUpperCase();
    const apiKey = process.env.STOCK_API_KEY; // Pulled securely from your .env file

    // 2. Make the request to the live stock API
    const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);

    // 3. If the API returns empty data, the stock doesn't exist
    if (response.data.d === null) {
      return res.status(404).json({ message: 'Stock symbol not found' });
    }

    // 4. Clean up the data to send exactly what your database/frontend needs
    const stockData = {
      symbol: symbol,
      currentPrice: response.data.c, // 'c' is Finnhub's key for Current price
      highOfDay: response.data.h,    // 'h' is High price
      lowOfDay: response.data.l,     // 'l' is Low price
      openPrice: response.data.o     // 'o' is Open price
    };

    // Send the formatted data back to the user
    res.json(stockData);

  } catch (error) {
    console.error('API Fetch Error:', error.message);
    res.status(500).json({ message: 'Server Error fetching stock data' });
  }
});

module.exports = router;