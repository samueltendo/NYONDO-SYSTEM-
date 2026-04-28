const express = require('express');
const router = express.Router();

// Mock Data: This simulates your database for now
let staffList = [
    { fullname: "Musa Nyondo", phone: "0701234567", nin: "CM8501234567YZ", role: "Accounts/Admin", email: "admin@nyondo.com", password: "nyondo" },
    { fullname: "Sarah Atwine", phone: "0772000111", nin: "CF9007654321AB", role: "Sales Attendant", email: "sarah@nyondo.com", password: "nyondo" },
    { fullname: "John Okello", phone: "0783000222", nin: "CM9109876543CD", role: "Store Manager", email: "john@nyondo.com", password: "nyondo" }
];

// GET: Display the Staff Directory (List View)
router.get('/', (req, res) => {
    res.render('user', { 
        title: 'Staff Management',
        users: staffList 
    });
});

// GET: Display Registration Form
router.get('/register', (req, res) => {
    res.render('register', { title: 'Register New Staff' });
});

// POST: Process Registration
router.post('/register', (req, res) => {
    const { fullname, phone, nin, role, email, password } = req.body;

    //  Backend Validation
    if (!fullname || !phone || !nin || !email || !password) {
        return res.status(400).send("Validation Error: Missing required fields.");
    }

    // Create new user object
    const newUser = { fullname, phone, nin, role, email, password };
    
    // Add to our list (In production, this would be: db.run("INSERT INTO users..."))
    staffList.push(newUser);

    // Redirect back to the staff list to see the update
    res.redirect('/users');
});

module.exports = router;