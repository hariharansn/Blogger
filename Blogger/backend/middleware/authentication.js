// authentication.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware function to authenticate the user
const authenticate = async (req, res, next) => {
  try {
    // Get the JWT token from the request headers
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Missing authentication token' });
    }

    // Verify the JWT token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user associated with the token
    const user = await User.findByPk(decodedToken.userId);

    if (!user) {
      return res.status(401).json({ message: 'Invalid authentication token' });
    }

    // Attach the user object to the request for future use
    req.user = user;

    // Move to the next middleware
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Invalid authentication token' });
  }
};

const generateToken = (userId) => {
    // Generate a JWT token with the user ID
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
  };
  
  const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find the user by email and verify the password
      const user = await User.findOne({ where: { email } });
      if (!user || !user.verifyPassword(password)) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // Generate a JWT token
      const token = generateToken(user.id);
  
      // Return the token to the client
      res.status(200).json({ token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  };


  module.exports = {
    authenticate,
    login,
  };