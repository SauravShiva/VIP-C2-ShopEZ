import { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Portfolio() {
  const [portfolio, setPortfolio] = useState(null);
  const [error, setError] = useState('');

  // Colors for our pie chart slices
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#e83e8c'];

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/portfolio', {
          headers: { 'x-auth-token': token }
        });
        setPortfolio(response.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setPortfolio({ balance: 100000, holdings: [] });
          setError(''); // Clear the error
        } else {
        setError(err.response?.data?.message || 'Failed to load portfolio.');
      }
    }
};

    fetchPortfolio();
  }, []);

  if (error) return <div className="alert alert-danger mt-4">{error}</div>;
  if (!portfolio) return <div className="mt-4">Loading your assets...</div>;

  // Format data for the pie chart: calculate total value of each stock
  const chartData = portfolio.holdings.map(stock => ({
    name: stock.stockSymbol,
    value: Number((stock.quantity * stock.averageBuyPrice).toFixed(2))
  }));

  return (
    <div className="mt-4">
      <h2 className="mb-4">My Dashboard</h2>
      
      {/* Balance Card */}
      <div className="card text-white bg-success mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Purchasing Power</h5>
          <h2 className="card-text">${portfolio.balance.toLocaleString()}</h2>
        </div>
      </div>

      <div className="row">
        {/* Holdings Table (Left Side) */}
        <div className="col-md-6 mb-4">
          <h4 className="mb-3">Current Holdings</h4>
          {portfolio.holdings.length === 0 ? (
            <div className="alert alert-info">No stocks owned.</div>
          ) : (
            <div className="table-responsive shadow-sm">
              <table className="table table-hover table-bordered mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Stock Symbol</th>
                    <th>Shares Owned</th>
                    <th>Avg Buy Price</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.holdings.map((stock, index) => (
                    <tr key={index}>
                      <td className="fw-bold">{stock.stockSymbol}</td>
                      <td>{stock.quantity}</td>
                      <td>${stock.averageBuyPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recharts Pie Chart (Right Side) */}
        <div className="col-md-6 mb-4">
          <h4 className="mb-3">Asset Allocation</h4>
          {portfolio.holdings.length === 0 ? (
            <div className="alert alert-light border">Buy stocks to see your visual allocation.</div>
          ) : (
            <div className="card shadow-sm p-3" style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Portfolio;