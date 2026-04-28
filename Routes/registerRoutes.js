const express = require('express');
const router = express.Router();
const User = require('../models/Users');

// GET: Display Registration Form
router.get('/register', (req, res) => {
    res.render('register', { title: 'Staff Registration' });
});

// POST: Process Registration
router.post('/register', async (req, res) => {
    try {
        const { fullname, phone, nin, role, email, password } = req.body;

        // 1. Validation Logic
        if (nin.length !== 14) {
            return res.render('register', { error: "NIN must be exactly 14 characters.", formData: req.body });
        }
        if (!/^\d{10}$/.test(phone)) {
            return res.render('register', { error: "Phone number must be 10 digits.", formData: req.body });
        }

        // 2. Save to MongoDB
        const newUser = new User({ fullname, phone, nin, role, email, password });
        await newUser.save();

        res.redirect('/users?status=registered');
    } catch (err) {
        res.render('register', { error: "Error: " + err.message, formData: req.body });
    }
});

// GET: View Staff List
router.get('/', async (req, res) => {
    const staff = await User.find().sort({ fullname: 1 });
    res.render('users', { title: 'Staff Directory', staff });
});

module.exports = router;