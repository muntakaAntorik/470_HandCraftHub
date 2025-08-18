// server/routes/review.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Review = require('../models/Review');
const Product = require('../models/Product'); // To update product rating
const User = require('../models/User'); // To get user's name

// @route   POST /api/reviews/:productId
// @desc    Add a review to a product
// @access  Private
router.post('/:productId', authMiddleware, async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Check if user has already reviewed this product
    const alreadyReviewed = await Review.findOne({
      product: productId,
      user: req.user.id,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ msg: 'Product already reviewed by this user' });
    }

    const user = await User.findById(req.user.id).select('name');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    const review = new Review({
      product: productId,
      user: req.user.id,
      name: user.name,
      rating: Number(rating),
      comment,
    });

    await review.save();

    // Update product's average rating and number of reviews
    const reviews = await Review.find({ product: productId });
    product.numReviews = reviews.length;
    product.rating =
      reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await product.save();

    res.status(201).json({ msg: 'Review added successfully', review });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/reviews/:productId
// @desc    Get all reviews for a specific product
// @access  Public
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name');
    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
