const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const passport = require("passport");
const { ensureAuthenticated, ensureRole } = require('../middleware/auth');

// Display Login Form 
router.get('/login', (req, res) => {
    res.render('login', { title: 'Staff Login' }); // Using my 'login.pug'
});

// POST: Handle Login with Passport
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.render('login', { 
                title: 'Staff Login', 
                error: info.message || 'Invalid email or password.' 
            });
        }

        req.logIn(user, (err) => {
            if (err) return next(err);

            console.log(`Login Successful: ${user.fullname} (${user.role})`);

            // Role-Based Redirection (Matching your lowercase roles)
            if (user.role === 'attendant' || user.role === 'Sales Attendant') {
                return res.redirect('/sales_dashboard');
            }
            if (user.role === 'manager' || user.role === 'Store Manager') {
                return res.redirect('/manager_dashboard');
            }
            if (user.role === 'admin' || user.role === 'Accounts') {
                return res.redirect('/dashboard');
            }
            
            res.redirect('/dashboard');
        });
    })(req, res, next);
});

// GET: Display Registration Form
router.get("/register", ensureAuthenticated, ensureRole('admin'), (req, res) => {
    res.render('register', { title: "Staff Registration" });
});

// POST: Process Registration
router.post("/register", ensureAuthenticated, ensureRole('admin'), async (req, res) => {
    try {
        const { fullname, phone, nin, role, email, password } = req.body;

        // Validation
        if (nin.length !== 16) return res.render("register", { error: "NIN must be 16 characters", formData: req.body });

        const newUser = new User({ fullname, phone, nin, role, email, password });
        await newUser.save();

        let successMsg = `Registration successful for ${fullname} (${role}). You can now log in.`;
        console.log(successMsg);
        let infoMsg = `New user registered: ${fullname} (${role}) with email ${email}`;
        console.info(infoMsg);
        let userExists = await User.findOne({ $or: [{ email }, { nin }] });
        if (userExists) {
            return res.render('register', { error: "Email or NIN already registered." });
        }

        res.redirect("/auth/login"); 
    } catch (err) {
        res.render("register", { error: "Failed: " + err.message, formData: req.body });
    }
      
      const nin = req.body.nin?.toUpperCase();

        const NIN_REGEX = /^[A-Z0-9]{16}$/;

        if (!NIN_REGEX.test(nin)) {
            return res.render("register", {
                error: "NIN must be 16 uppercase letters/numbers (e.g., CM12345678901234).",
                formData: req.body
            });
        }
});

// Logout
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect("/auth/login");
    });
});

module.exports = router;