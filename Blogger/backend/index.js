const app = require('./app');
const sequelize = require('./config/database');

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log(`Server is listening on port ${port}`);

  // Connect to the database
  try {
    await sequelize.authenticate();
    console.log('Connected to the database');

    // Sync the database models
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});
