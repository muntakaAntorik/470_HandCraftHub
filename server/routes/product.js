// server/routes/product.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // For general authentication
const Product = require('../models/Product');
const User = require('../models/User'); // To verify seller role
const mongoose = require('mongoose'); // To use ObjectId

// Middleware to check if the user is a seller (used for seller-specific routes)
const sellerAuthMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'seller') {
    return res.status(403).json({ msg: 'Not authorized as a seller' });
  }
  next();
};

// Middleware to check if the user is an admin (used for admin-specific routes)
const adminAuthMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Not authorized as an admin' });
  }
  next();
};

// @route   GET /api/products
// @desc    Get all products (with optional search/category filter)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
              name: {
                $regex: req.query.keyword,
                $options: 'i',
              },
            }
          : {};

    const category = req.query.category
      ? {
              category: req.query.category,
            }
          : {};

    const products = await Product.find({ ...keyword, ...category });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error: Could not retrieve products.');
  }
});

// @route   GET /api/products/seller/:sellerId
// @desc    Get products by a specific seller
// @access  Private (Seller only)
router.get('/seller/:sellerId', authMiddleware, sellerAuthMiddleware, async (req, res) => {
  try {
    // Crucial fix: Ensure the logged-in user's ID matches the sellerId in the URL parameter
    // req.user.id is a string, req.params.sellerId is also a string
    if (req.user.id !== req.params.sellerId) {
      return res.status(401).json({ msg: 'Not authorized to view these products' });
    }
    const products = await Product.find({ seller: req.params.sellerId });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error: Could not retrieve seller products.');
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
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found (Invalid ID format)' });
    }
    res.status(500).send('Server Error: Could not retrieve product.');
  }
});

// @route   POST /api/products
// @desc    Create a new product
// @access  Private (Seller only)
router.post('/', authMiddleware, sellerAuthMiddleware, async (req, res) => {
  const { name, description, price, imageUrl, category, countInStock } = req.body;

  if (!name || !description || !price || !imageUrl || !category || !countInStock) {
    return res.status(400).json({ msg: 'Please enter all product fields' });
  }

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      imageUrl,
      category,
      countInStock: Number(countInStock),
      seller: req.user.id, // Assign the logged-in user as the seller
      rating: 0,
      numReviews: 0,
    });

    const product = await newProduct.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error: Could not create product.');
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private (Seller only, and only for their own products)
router.put('/:id', authMiddleware, sellerAuthMiddleware, async (req, res) => {
  const { name, description, price, imageUrl, category, countInStock } = req.body;

  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Ensure the logged-in user is the product's seller
    if (product.seller.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to update this product' });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.imageUrl = imageUrl || product.imageUrl;
    product.category = category || product.category;
    product.countInStock = countInStock !== undefined ? Number(countInStock) : product.countInStock;

    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found (Invalid ID format)' });
    }
    res.status(500).send('Server Error: Could not update product.');
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private (Seller/Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Allow deletion if the user is the seller OR an admin
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized to delete this product' });
    }

    await product.deleteOne();
    res.json({ msg: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found (Invalid ID format)' });
    }
    res.status(500).send('Server Error: Could not delete product.');
  }
});


module.exports = router;