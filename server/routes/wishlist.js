    // server/routes/wishlist.js

    const express = require('express');
    const router = express.Router();
    const authMiddleware = require('../middleware/authMiddleware'); // Re-use auth middleware
    const Wishlist = require('../models/Wishlist');

    // @route   POST /api/wishlist/add
    // @desc    Add a product name to the wishlist
    // @access  Private
    router.post('/add', authMiddleware, async (req, res) => {
      const { productName } = req.body;

      try {
        if (!productName || productName.trim() === '') {
          return res.status(400).json({ msg: 'Product name is required' });
        }

        const newWishlistItem = new Wishlist({
          user: req.user.id,
          productName: productName.trim()
        });

        await newWishlistItem.save();
        res.json({ msg: 'Product added to wishlist', item: newWishlistItem });

      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    });

    // @route   GET /api/wishlist/all
    // @desc    Get all wishlist items from all users
    // @access  Public (as requested, to show all items by all users)
    router.get('/all', async (req, res) => {
      try {
        const allWishlistItems = await Wishlist.find().populate('user', 'name email'); // Populate user details
        res.json(allWishlistItems);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    });

    // @route   GET /api/wishlist/my
    // @desc    Get current user's wishlist items
    // @access  Private
    router.get('/my', authMiddleware, async (req, res) => {
      try {
        const myWishlistItems = await Wishlist.find({ user: req.user.id }).populate('user', 'name email');
        res.json(myWishlistItems);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    });

    // @route   DELETE /api/wishlist/remove/:id
    // @desc    Remove an item from the wishlist
    // @access  Private
    router.delete('/remove/:id', authMiddleware, async (req, res) => {
      try {
        const wishlistItem = await Wishlist.findById(req.params.id);

        if (!wishlistItem) {
          return res.status(404).json({ msg: 'Wishlist item not found' });
        }

        // Ensure user owns the wishlist item
        if (wishlistItem.user.toString() !== req.user.id) {
          return res.status(401).json({ msg: 'User not authorized' });
        }

        await wishlistItem.deleteOne(); // Use deleteOne()
        res.json({ msg: 'Wishlist item removed' });

      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    });

    module.exports = router;
    
    