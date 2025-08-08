    const mongoose = require('mongoose');

    const WishlistSchema = new mongoose.Schema({
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      productName: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    });

    module.exports = mongoose.model('Wishlist', WishlistSchema);
    