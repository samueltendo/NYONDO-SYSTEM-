const express = require('express');
const router = express.Router();
const User = require('../models/Users');

// GET: Display Login Page
router.get('/login', (req, res) => {
    res.render('login', { title: 'Staff Login' });
});

// POST: Process Login & Role-Based Redirection
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && user.password === password) {
            // Set session for identifying user in layout and routes
            req.session.user = {
                id: user._id,
                name: user.fullname,
                role: user.role // attendant, manager, or admin
            };

            // Role-Based Redirection Logic
            if (user.role === 'attendant') {
                return res.redirect('/sales');
            } else if (user.role === 'manager') {
                return res.redirect('/stock');
            } else {
                return res.redirect('/dashboard'); // Default for Admins
            }
        }

        // Error handling for incorrect credentials
        res.render('login', { 
            title: 'Staff Login', 
            error: 'Invalid staff email or password.' 
        });

    } catch (err) {
        res.status(500).send("Login Error: " + err.message);
    }
});

// GET: Logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.redirect('/dashboard');
        res.clearCookie('nyondo.sid'); // Must match session name in server.js
        res.redirect('/'); // Redirect back to Welcome Page
    });
});

module.exports = router;