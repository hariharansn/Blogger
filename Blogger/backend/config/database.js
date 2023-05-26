const { Sequelize } = require('sequelize');

// Create Sequelize instance
const sequelize = new Sequelize('test', 'postgres', 'password', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
});

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });

module.exports = sequelize;
