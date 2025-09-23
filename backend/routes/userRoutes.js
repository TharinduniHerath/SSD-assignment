const express = require('express');
const router = express.Router();
const {protect, admin,authorizeRoles} = require('../middleware/authMiddleware');

const csrf = require('csurf');

// CSRF middleware
const csrfProtection = csrf({ cookie: true });



const { authUser, registerUser, getUserProfile, updateUserProfile, getUsers, deleteUser, getUserById, updateUser, getUserStats } = require('../controllers/userController')

// State-changing routes with CSRF protection
router.post('/', csrfProtection, registerUser);                     // Register user
router.post('/login', csrfProtection, authUser);                    // Login (optional, prevents login CSRF)
router.put('/profile', protect, csrfProtection, updateUserProfile); // Update profile
router.delete('/:id', protect, authorizeRoles('admin'), csrfProtection, deleteUser);  // Delete user
router.put('/:id', protect, authorizeRoles('admin'), csrfProtection, updateUser);     // Update user

// GET routes remain unprotected
router.get('/profile', protect, getUserProfile);
router.get('/', protect, authorizeRoles('admin'), getUsers);
router.get('/:id', protect, authorizeRoles('admin'), getUserById);
router.get('/stats', protect, authorizeRoles('admin'), getUserStats);

module.exports = router;