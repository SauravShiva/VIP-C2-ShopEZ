import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Portfolio from './components/Portfolio';
import Market from './components/Market';
import Admin from './components/Admin';

function App() {
  return (
    <Router>
      <Navbar /> 
      <div className="container mt-4">
        <h2>ShopEZ Trading Platform</h2>
        <Routes>
          <Route path="/" element={<Market />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;