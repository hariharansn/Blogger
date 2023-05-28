const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User }= require('../models/model');
require('dotenv').config();


// User registration
exports.registerUser = async (req, res, next) => {
  const { username, password } = req.body;

  // Check if any required fields are missing
  const requiredFields = [];
  if (!username) requiredFields.push('username');
  if (!password) requiredFields.push('password');

  if (requiredFields.length > 0) {
    return res.status(400).json({ message: `The following fields are required: ${requiredFields.join(', ')}` });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { username: username } });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    await User.create({ username, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    next(err); // Pass the error to the error handling middleware
  }
};

// User login
exports.loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if any required fields are missing
    const requiredFields = [];
    if (!username) requiredFields.push('username');
    if (!password) requiredFields.push('password');

    if (requiredFields.length > 0) {
      return res.status(400).json({ message: `The following fields are required: ${requiredFields.join(', ')}` });
    }

    // Find the user in the database
    const user = await User.findOne({ where: { username: username } });
    if (!user) {
      res.status(401).json({ error: 'Authentication failed User Not Registered' });
    } else {
      // Compare the provided password with the hashed password in the database
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        return res.status(401).json({ error: 'Authentication failed' });
      } else {
        // Generate a JWT token
        const token = jwt.sign({ userId: user.id }, 'secretKey');

        // Send the token as a response
        res.json({ token });
      }
    }
  } catch (err) {
    console.error('Error retrieving user:', err);
    next(err); // Pass the error to the error handling middleware
  }
};

