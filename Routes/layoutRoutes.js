const express = require('express');
const router = express.Router();

/**
 * Global Middleware
 * This ensures the 'user' variable is available to layout.pug on every request.
 */
router.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.path = req.path; // Useful for highlighting active links
    next();
});

/**
 * @route   GET /
 * @desc    Main Entry Point - Checks if user is logged in to redirect them
 */
router.get('/', (req, res) => {
    if (req.session.user) {
        const role = req.session.user.role;
        // Role-based landing after login
        if (role === 'admin' || role === 'manager') return res.redirect('/dashboard');
        if (role === 'attendant') return res.redirect('/sales');
    }
    // If not logged in, show the welcome/landing page
    res.render('welcome', { title: 'Welcome' });
});

/**
 * @route   GET /about
 * @desc    General Information Page (Uses layout.pug)
 */
router.get('/about', (req, res) => {
    res.render('about', { title: 'About Nyondo System' });
});

module.exports = router;