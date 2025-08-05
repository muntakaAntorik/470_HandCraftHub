    // server/models/Product.js

    const mongoose = require('mongoose');

    const ProductSchema = new mongoose.Schema({
      name: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      imageUrl: {
        type: String,
        required: true
      },
      category: {
        type: String,
        required: true
      },
      // Assuming a seller uploads products
      seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      rating: {
        type: Number,
        default: 0
      },
      numReviews: {
        type: Number,
        default: 0
      },
      countInStock: {
        type: Number,
        required: true,
        default: 0
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    });

    module.exports = mongoose.model('Product', ProductSchema);
    