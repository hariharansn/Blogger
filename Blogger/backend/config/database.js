const { Sequelize } = require('sequelize');
const initializeTables = require('../models/model');

// Create Sequelize instance
const sequelize = new Sequelize('production', 'postgres', 'password', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
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
