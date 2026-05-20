const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const passport = require("passport");

// GET: Display Login Form 
// Access at: http://localhost:3000/auth/login
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
// Access at: http://localhost:3000/register
router.get("/register", (req, res) => {
    res.render("register", { title: "Staff Registration" });
});

// POST: Process Registration
router.post("/register", async (req, res) => {
    try {
        const { fullname, phone, nin, role, email, password } = req.body;

        // Validation
        if (nin.length !== 14) return res.render("register", { error: "NIN must be 14 chars", formData: req.body });

        const newUser = new User({ fullname, phone, nin, role, email, password });
        await newUser.save();

        res.redirect("/auth/login"); 
    } catch (err) {
        res.render("register", { error: "Failed: " + err.message, formData: req.body });
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