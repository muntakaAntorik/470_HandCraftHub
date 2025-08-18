// server/routes/product.js

const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Ensure Product model is correctly imported

// @route   GET /api/products
// @desc    Get all products (with optional search/category filter)
// @access  Public
router.get('/', async (req, res) => {
  console.log('Backend: Received GET request for /api/products');
  console.log('Backend: Query parameters:', req.query);
  
  try {
    const keyword = req.query.keyword
      ? {
              name: {
                $regex: req.query.keyword,
                $options: 'i', // Case-insensitive search
              },
            }
          : {};

    // This is the part that handles category filtering
    const category = req.query.category 
      ? {
              category: req.query.category, // Filter by the provided category
            }
          : {};

    // Find products matching both keyword and category filters
    // If no keyword or category is provided, it will fetch all products.
    const products = await Product.find({ ...keyword, ...category });
    console.log(`Backend: Found ${products.length} products.`);
    res.json(products); // Send the products as a JSON response

  } catch (err) {
    console.error('Backend Error: Failed to fetch products:', err.message);
    res.status(500).send('Server Error: Could not retrieve products.'); // More specific error message
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error('Backend Error: Failed to fetch single product:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found (Invalid ID format)' });
    }
    res.status(500).send('Server Error: Could not retrieve product.');
  }
});

module.exports = router;
