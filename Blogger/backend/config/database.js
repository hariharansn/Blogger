const { Sequelize } = require('sequelize');
const initializeTables = require('../models/model');
require('dotenv').config();

// Create Sequelize instance
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  port: process.env.DB_PORT,
  timezone: '+05:30',
  define: {
    // Global options for model definition
    timestamps: true,
    underscored: true
  },
  dialectOptions: {
    useUTC: false,
    useIST:true,
  },
});

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected');
    initializeTables();
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });

module.exports = sequelize;
