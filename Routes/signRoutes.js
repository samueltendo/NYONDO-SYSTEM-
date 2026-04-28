const express = require('express');
const router = express.Router();

// GET: Display Login Page
router.get('/login', (req, res) => {
    res.render('sign', { title: 'Staff Login' });
});

// POST: Handle Login and Role-Based Redirection
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // 1. Mock Authentication (In production, check against SQLite database)
    // We are simulating different roles for testing:
    let redirectUrl = '/dashboard';

    if (email === 'sales@nyondo.com') {
        // Sales Attendants go straight to the Sales Desk
        redirectUrl = '/sales';
    } else if (email === 'manager@nyondo.com') {
        // Store Managers go to the Stock Inventory
        redirectUrl = '/stock';
    } else if (email === 'admin@nyondo.com') {
        // Admin goes to the Main Dashboard
        redirectUrl = '/dashboard';
    } else {
        // Default fallback or error
        return res.render('sign', { 
            title: 'Staff Login', 
            error: 'Invalid credentials. Please use staff email.' 
        });
    }

    console.log(`User ${email} logged in. Redirecting to ${redirectUrl}`);
    res.redirect(redirectUrl);
});

module.exports = router;