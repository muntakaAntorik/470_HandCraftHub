    // server/routes/cart.js

    const express = require('express');
    const router = express.Router();
    const authMiddleware = require('../middleware/authMiddleware'); // We'll create this middleware next
    const Cart = require('../models/Cart');
    const Product = require('../models/Product'); // Import Product model

    // @route   GET /api/cart
    // @desc    Get user's cart
    // @access  Private
    router.get('/', authMiddleware, async (req, res) => {
      try {
        let cart = await Cart.findOne({ user: req.user.id }).populate('items.product', 'name price imageUrl');
        if (!cart) {
          // If no cart exists for the user, return an empty cart
          cart = new Cart({ user: req.user.id, items: [] });
          await cart.save(); // Save the new empty cart
        }
        res.json(cart);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    });

    // @route   POST /api/cart/add
    // @desc    Add item to cart
    // @access  Private
    router.post('/add', authMiddleware, async (req, res) => {
      const { productId, quantity } = req.body;

      try {
        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
          // If no cart exists for the user, create a new one
          cart = new Cart({ user: req.user.id, items: [] });
        }

        const product = await Product.findById(productId);

        if (!product) {
          return res.status(404).json({ msg: 'Product not found' });
        }

        // Check if item already exists in cart
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
          // Update quantity if item already exists
          cart.items[itemIndex].quantity += quantity;
        } else {
          // Add new item to cart
          cart.items.push({
            product: productId,
            name: product.name,
            imageUrl: product.imageUrl,
            price: product.price,
            quantity
          });
        }

        await cart.save();
        res.json(cart);

      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    });

    // @route   PUT /api/cart/update
    // @desc    Update item quantity in cart
    // @access  Private
    router.put('/update', authMiddleware, async (req, res) => {
      const { productId, quantity } = req.body;

      try {
        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
          return res.status(404).json({ msg: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
          if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            cart.items.splice(itemIndex, 1);
          } else {
            cart.items[itemIndex].quantity = quantity;
          }
          await cart.save();
          res.json(cart);
        } else {
          return res.status(404).json({ msg: 'Item not found in cart' });
        }

      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    });

    // @route   DELETE /api/cart/remove/:productId
    // @desc    Remove item from cart
    // @access  Private
    router.delete('/remove/:productId', authMiddleware, async (req, res) => {
      try {
        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
          return res.status(404).json({ msg: 'Cart not found' });
        }

        const initialLength = cart.items.length;
        cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);

        if (cart.items.length === initialLength) {
          return res.status(404).json({ msg: 'Item not found in cart' });
        }

        await cart.save();
        res.json(cart);

      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    });

    module.exports = router;
    