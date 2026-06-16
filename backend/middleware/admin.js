module.exports = function(req, res, next) {
  // We check the role that was attached to the user's digital key
  if (req.user && req.user.role === 'ADMIN') {
    next(); // They are an admin, let them through
  } else {
    // 403 Forbidden means "I know who you are, but you don't have permission"
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};