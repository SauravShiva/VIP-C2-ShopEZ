import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  // These hold the data the user types into the form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate(); // Tool to redirect the user

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing when you hit submit
    setError('');

    try {
      // 1. Send the data to your exact Express backend route
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      // 2. Save the digital key to the browser's local storage
      localStorage.setItem('token', response.data.token);

      // 3. Redirect the user to the portfolio page!
      navigate('/portfolio');

    } catch (err) {
      // If the backend sends back a 400 error (wrong password), display it
      setError(err.response?.data?.message || 'Server error occurred');
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-6">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h3 className="text-center mb-4">Login to ShopEZ</h3>
            
            {/* Show error message box if something goes wrong */}
            {error && <div className="alert alert-danger">{error}</div>}
            
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
            </form>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;