    // server/server.js

    const express = require('express');
    const mongoose = require('mongoose');
    const cors = require('cors');
    require('dotenv').config();

    const app = express();
    const PORT = process.env.PORT || 5000;

    // Middleware
    app.use(cors());
    app.use(express.json());

    // MongoDB Connection
    mongoose.connect(process.env.MONGO_URI)
      .then(() => console.log('MongoDB connected successfully'))
      .catch(err => console.error('MongoDB connection error:', err));

    // Define Routes
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/cart', require('./routes/cart'));
    app.use('/api/wishlist', require('./routes/wishlist')); // Add wishlist routes
    // app.use('/api/products', require('./routes/product')); // Product routes will be added later

    // Basic route to test the server
    app.get('/', (req, res) => {
      res.send('API is running...');
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    