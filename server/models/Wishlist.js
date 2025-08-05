    // server/models/Wishlist.js

    const mongoose = require('mongoose');

    const WishlistSchema = new mongoose.Schema({
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      productName: { // Storing the product name directly as requested
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    });

    module.exports = mongoose.model('Wishlist', WishlistSchema);
    