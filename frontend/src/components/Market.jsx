import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Market() {
  const [symbol, setSymbol] = useState('');
  const [stockData, setStockData] = useState(null);
  const [quantity, setQuantity] = useState(1); // How many shares to trade
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // Success message
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // 1. Existing Search Logic
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!symbol) return;
    setError(''); setMessage(''); setStockData(null); setLoading(true);

    try {
      const response = await axios.get(`http://localhost:5000/api/stocks/${symbol}`);
      setStockData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching stock data.');
    } finally {
      setLoading(false);
    }
  };

  // 2. NEW: Buy and Sell Logic
  const handleTrade = async (tradeType) => {
    setError(''); setMessage('');
    
    // Check if they have their digital key!
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to trade!');
      setTimeout(() => navigate('/login'), 2000); // Send them to login after 2 seconds
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/transactions/${tradeType}`, 
        {
          stockSymbol: stockData.symbol,
          quantity: Number(quantity),
          price: stockData.currentPrice
        },
        {
          headers: { 'x-auth-token': token } // Show the bouncer the key
        }
      );

      // Show success message and reset quantity
      setMessage(response.data.message);
      setQuantity(1);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${tradeType} stock.`);
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-center mb-4">Live Market Explorer</h2>
      
      {/* Search Bar */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          <form onSubmit={handleSearch} className="d-flex shadow-sm">
            <input
              type="text"
              className="form-control form-control-lg me-2"
              placeholder="Enter Stock Symbol (e.g., AAPL)"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            />
            <button type="submit" className="btn btn-primary btn-lg">
              {loading ? '...' : 'Search'}
            </button>
          </form>
        </div>
      </div>

      {/* Alerts */}
      {error && <div className="alert alert-danger text-center col-md-6 mx-auto">{error}</div>}
      {message && <div className="alert alert-success text-center col-md-6 mx-auto">{message}</div>}

      {/* Stock Data Display Card */}
      {stockData && (
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow border-primary">
              <div className="card-header bg-primary text-white text-center">
                <h3 className="mb-0">{stockData.symbol}</h3>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                  <span className="text-muted fw-bold">Current Price:</span>
                  <span className="fs-4 text-success fw-bold">${stockData.currentPrice.toFixed(2)}</span>
                </div>
                
                {/* NEW: Trading Controls */}
                <div className="mt-4 pt-3 border-top">
                  <label className="form-label fw-bold">Shares to Trade:</label>
                  <input 
                    type="number" 
                    className="form-control mb-3" 
                    min="1" 
                    value={quantity} 
                    onChange={(e) => setQuantity(e.target.value)} 
                  />
                  <div className="d-flex gap-2">
                    <button onClick={() => handleTrade('buy')} className="btn btn-success w-50">Buy Shares</button>
                    <button onClick={() => handleTrade('sell')} className="btn btn-danger w-50">Sell Shares</button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Market;