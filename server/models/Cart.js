    // server/models/Cart.js

    const mongoose = require('mongoose');

    const CartItemSchema = new mongoose.Schema({
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // We will create a Product model later
        required: true
      },
      name: { // Storing name for easier display without populating product
        type: String,
        required: true
      },
      imageUrl: { // Storing image URL for easier display
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1
      }
    });

    const CartSchema = new mongoose.Schema({
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // Each user has only one cart
      },
      items: [CartItemSchema], // Array of cart items
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    });

    // Update 'updatedAt' field on save
    CartSchema.pre('save', function(next) {
      this.updatedAt = Date.now();
      next();
    });

    module.exports = mongoose.model('Cart', CartSchema);
    