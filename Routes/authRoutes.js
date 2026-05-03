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
// console.log(req.body)

        // TODO:1. :Validation Logic
        // if (nin.length !== 14) {
        //     return res.render('register', { error: "NIN must be exactly 14 characters.", formData: req.body });
        // }
        // if (!/^\d{10}$/.test(phone)) {
        //     return res.render('register', { error: "Phone number must be 10 digits.", formData: req.body });
        // }

        // 2. Save to MongoDB
        const newUser = new User({ fullname, phone, nin, role, email, password });
        console.log(newUser)
        await newUser.save().then(result=>console.log(result)).catch(err=>console.log(err));

        res.redirect('/');
    } catch (err) {
        res.render('register', { error: "Error: " + err.message, formData: req.body });
    }
});


module.exports = router;