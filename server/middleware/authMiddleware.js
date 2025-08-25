// server/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model

module.exports = async function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from the database to get their full details, including name and email
    const user = await User.findById(decoded.user.id).select('-password'); // Exclude password
    
    if (!user) {
      return res.status(401).json({ msg: 'Token is valid, but user not found' });
    }

    // Attach the user object (including name, email, and role) to the request
    req.user = {
      id: user._id.toString(), // Ensure ID is a string for comparison
      name: user.name,
      email: user.email,
      role: user.role
    };
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};