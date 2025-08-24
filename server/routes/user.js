// server/routes/user.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

// Middleware to check if the user is an admin
const adminAuthMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Not authorized as an admin' });
  }
  next();
};

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private
router.get('/', authMiddleware, adminAuthMiddleware, async (req, res) => {
  try {
    // Find all users and exclude their password and tokens for security
    const users = await User.find().select('-password -tokens');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error: Could not retrieve users.');
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete a user (Admin only)
// @access  Private
router.delete('/:id', authMiddleware, adminAuthMiddleware, async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);

    if (!userToDelete) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Prevents admin from deleting themselves
    if (userToDelete._id.toString() === req.user.id) {
      return res.status(400).json({ msg: 'Cannot delete own admin account' });
    }

    await userToDelete.deleteOne();
    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found (Invalid ID format)' });
    }
    res.status(500).send('Server Error: Could not delete user.');
  }
});

module.exports = router;
