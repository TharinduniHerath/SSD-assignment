const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// @desc    Start Google OAuth
// @route   GET /auth/google
// @access  Public
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// @desc    Google OAuth callback
// @route   GET /auth/google/callback
// @access  Public
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login' }),
  (req, res) => {
    try {
      // Generate JWT token for OAuth user
      const token = jwt.sign(
        { 
          userId: req.user._id, 
          email: req.user.email,
          provider: 'google' 
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Set secure HTTP-only cookie
      res.cookie('_auth', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000 // 1 hour
      });

      // Redirect to frontend success page
      res.redirect('http://localhost:3000/oauth/success');
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect('http://localhost:3000/login?error=oauth_failed');
    }
  }
);

// @desc    Get OAuth user profile
// @route   GET /auth/profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const token = req.cookies._auth;
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const OAuthUser = require('../models/oauthUserModel');
    const user = await OAuthUser.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        provider: user.provider
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// @desc    OAuth logout
// @route   POST /auth/logout
// @access  Private
router.post('/logout', (req, res) => {
  res.clearCookie('_auth', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router;