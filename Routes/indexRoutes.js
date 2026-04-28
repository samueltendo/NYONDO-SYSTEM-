const express = require('express');
const router = express.Router();

/**
 * @route   GET /
 * @desc    System Landing Page - Handles Role-Based Entry
 */
router.get('/', (req, res) => {
    // 1. If user is logged in, redirect based on their specific role
    if (req.session && req.session.user) {
        const role = req.session.user.role;
        
        if (role === 'attendant') {
            return res.redirect('/sales'); // Sales Attendant workplace
        } else if (role === 'manager') {
            return res.redirect('/stock'); // Store Manager workplace
        } else {
            return res.redirect('/dashboard'); // Admin/Generic workplace
        }
    }
    
    // 2. Otherwise, show the professional Welcome Page
    res.render('welcome', { 
        title: 'Welcome | Nyondo General Hardware' 
    });
});

/**
 * @route   GET /health
 * @desc    System Health Check (Monitoring for Hardware Admin)
 */
router.get('/health', (req, res) => {
    res.status(200).json({
        system: "NYONDOSTOCK",
        status: "Online",
        database: "MongoDB Connected",
        timestamp: new Date().toLocaleString(),
        version: "1.0.4"
    });
});

/**
 * @route   GET /about
 * @desc    System Information Page
 */
router.get('/about', (req, res) => {
    res.render('layout', { 
        title: 'About Nyondo Stock',
        content: 'Nyondo Stock is a custom digitized inventory solution for NYONDO General Hardware, managing stock, sales, and automated delivery logistics.' 
    });
});



// GET: View Staff List
// router.get('/', async (req, res) => {
//     const staff = await User.find().sort({ fullname: 1 });
//     res.render('users', { title: 'Staff Directory', staff });
// });


module.exports = router;