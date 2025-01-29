const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path'); // Add this to handle static file paths

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const ingredientRoutes = require('./routes/ingredientRoutes');
app.use('/ingredients', ingredientRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB:', err);
  });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
