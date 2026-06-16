import { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/admin/transactions', {
          headers: { 'x-auth-token': token }
        });
        setTransactions(response.data);
      } catch (err) {
        // If a normal user tries to view this, the backend blocks them!
        setError(err.response?.data?.message || 'Access Denied.');
      }
    };

    fetchAdminData();
  }, []);

  if (error) return <div className="alert alert-danger mt-5 text-center fw-bold">{error}</div>;
  if (transactions.length === 0) return <div className="mt-4">Loading platform data...</div>;

  return (
    <div className="mt-4">
      <h2 className="mb-4 text-danger fw-bold">Admin Control Room</h2>
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white">
          <h5 className="mb-0">Platform-Wide Transaction History</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Action</th>
                  <th>Symbol</th>
                  <th>Shares</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx._id}>
                    <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                    <td className="fw-bold">{tx.user?.name || 'Unknown User'}</td>
                    <td>{tx.user?.email || 'N/A'}</td>
                    <td>
                      <span className={`badge ${tx.tradeType === 'BUY' ? 'bg-success' : 'bg-danger'}`}>
                        {tx.tradeType}
                      </span>
                    </td>
                    <td className="fw-bold">{tx.stockSymbol}</td>
                    <td>{tx.quantity}</td>
                    <td>${tx.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;