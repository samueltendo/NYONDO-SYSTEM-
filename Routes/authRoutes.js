const express = require('express');
const router = express.Router();
const User = require('../models/Users');

<<<<<<< HEAD
// TODO: EITHER SIGNUP / LOGIN CODES

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
















// logout button
// router.get('/logout', (req, res, next) =>{

//   req.logout( (err)=>{

//     if(err) {

//       return next(err);

//     }

//     res.redirect('/')

//   })

// })




=======
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
>>>>>>> c3721b14a3c45d865b28048217d21b2c8937a7f1
