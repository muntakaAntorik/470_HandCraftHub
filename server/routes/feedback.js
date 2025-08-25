// server/routes/feedback.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Feedback = require('../models/Feedback');

const adminAuthMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Not authorized as an admin' });
  }
  next();
};

// @route   POST /api/feedback
// @desc    Submit new feedback from a logged-in user
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  const { message } = req.body;

  try {
    // We get user, name, and email from the token, which is handled by authMiddleware
    if (!req.user || !req.user.name || !req.user.email) {
        return res.status(401).json({ msg: 'Authentication failed. User data is incomplete.' });
    }
    
    const newFeedback = new Feedback({
      user: req.user.id,
      name: req.user.name,
      email: req.user.email,
      message,
    });

    const createdFeedback = await newFeedback.save();
    res.status(201).json({ msg: 'Feedback submitted successfully', feedback: createdFeedback });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error: Failed to submit feedback.');
  }
});

// @route   GET /api/feedback
// @desc    Get all feedback (Admin only)
// @access  Private
router.get('/', authMiddleware, adminAuthMiddleware, async (req, res) => {
  try {
    const feedbackList = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbackList);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error: Could not retrieve feedback.');
  }
});

module.exports = router;