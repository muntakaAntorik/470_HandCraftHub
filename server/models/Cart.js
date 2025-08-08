
    const mongoose = require('mongoose');

    const CartItemSchema = new mongoose.Schema({
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      name: { 
        type: String,
        required: true
      },
      imageUrl: { 
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
        unique: true 
      },
      items: [CartItemSchema], 
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    });


    CartSchema.pre('save', function(next) {
      this.updatedAt = Date.now();
      next();
    });

    module.exports = mongoose.model('Cart', CartSchema);
    