// server/routes/order.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Re-use auth middleware
const Order = require('../models/Order');
const Cart = require('../models/Cart'); // To clear cart after order

// @route   POST /api/orders
// @desc    Create new order from cart
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    taxPrice,
    shippingPrice,
    totalPrice
  } = req.body;

  try {
    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ msg: 'No order items' });
    }

    const order = new Order({
      user: req.user.id,
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    const createdOrder = await order.save();

    // Optionally, clear the user's cart after successful order creation
    await Cart.deleteOne({ user: req.user.id });
    console.log(`Cart for user ${req.user.id} cleared after order.`);

    res.status(201).json(createdOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/orders/myorders
// @desc    Get logged in user's orders
// @access  Private
router.get('/myorders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 }); // Sort by most recent
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private (can be extended to admin later)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order && order.user._id.toString() === req.user.id) {
      res.json(order);
    } else {
      res.status(404).json({ msg: 'Order not found or not authorized' });
    }
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Order not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
