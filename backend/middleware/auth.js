const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // 1. Get the token from the request header
  const token = req.header('x-auth-token');

  // 2. Check if no token was sent
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // 3. Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded user payload to the request object
    req.user = decoded; 
    next(); // Move on to the actual route (like the Buy Stock route)
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};