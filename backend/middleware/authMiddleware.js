const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// Protect routes – ensure the user is authenticated
const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user to req
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

// Admin-only middleware
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403); // Changed from 401 to 403
        throw new Error('Forbidden: Not authorized as an admin');
    }
};

// Flexible role-based middleware
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (req.user) {
            // Determine role: currently only 'admin' or 'user'
            const role = req.user.isAdmin ? 'admin' : 'user';
            if (roles.includes(role)) {
                return next();
            }
        }
        res.status(403);
        throw new Error("Forbidden: You don't have access to this resource");
    };
};

module.exports = { protect, admin, authorizeRoles };
