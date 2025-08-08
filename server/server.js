  

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

    // Routes
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/cart', require('./routes/cart'));
    app.use('/api/wishlist', require('./routes/wishlist')); 

    app.get('/', (req, res) => {
      res.send('API is running...');
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });