const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

// Register a new user
const registerUser = async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // Check if any required fields are missing
      const requiredFields = [];
      if (!username) requiredFields.push('username');
      if (!email) requiredFields.push('email');
      if (!password) requiredFields.push('password');
  
      if (requiredFields.length > 0) {
        return res.status(400).json({ message: `The following fields are required: ${requiredFields.join(', ')}` });
      }
  
      // Check if the email is already registered
      const existingUserEmail = await User.findOne({ where: { email } });
      if (existingUserEmail) {
        return res.status(409).json({ message: 'Email is already registered' });
      }
  
      // Check if the username is already taken
      const existingUserUsername = await User.findOne({ where: { username } });
      if (existingUserUsername) {
        return res.status(409).json({ message: 'Username is already taken' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user record
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
      });
  
      // Generate a JWT token
      let token;
      if (process.env.JWT_SECRET) {
        token = jwt.sign(
          { userId: newUser.id, email: newUser.email },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );
      } else {
        throw new Error('JWT secret key is not defined');
      }
  
      res.status(201).json({ message: 'User registered', token });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Failed to register user' });
    }
  };
  

// User login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if any required fields are missing
    const requiredFields = [];
    if (!email) requiredFields.push('email');
    if (!password) requiredFields.push('password');

    if (requiredFields.length > 0) {
      return res.status(400).json({ message: `The following fields are required: ${requiredFields.join(', ')}` });
    }

    // Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Failed to login' });
  }
};

// User logout
const logoutUser = async (req, res) => {
  try {
    const token = req.headers.authorization; // Assuming the token is provided in the Authorization header

    // Check if the token is missing
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify and decode the token
    jwt.verify(token, process.env.JWT_SECRET);

    // Delete the token from the database
    await Token.destroy({ where: { token } });

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Failed to logout' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
