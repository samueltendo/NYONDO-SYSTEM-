const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const { ensureAuthenticated, ensureRole } = require('../middleware/auth');

// 1. VIEW ALL USERS (The List Page)
router.get('/', ensureAuthenticated, ensureRole('admin'), async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.render('user_list', { title: 'User Directory', users });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// 2. EDIT USER (Show Form)
router.get('/edit/:id', ensureAuthenticated, ensureRole('admin'), async (req, res) => {
    try {
        const staff = await User.findById(req.params.id);
        res.render('user_edit', { title: 'Edit Staff Member', staff });
    } catch (err) {
        res.redirect('/users');
    }
});

// 3. UPDATE USER (Process Edit)
router.post('/edit/:id', ensureAuthenticated, ensureRole('admin'), async (req, res) => {
    try {
        const { fullname, email, phone, nin, role } = req.body;
        await User.findByIdAndUpdate(req.params.id, { fullname, email, phone, nin, role });
        res.redirect('/users?status=updated');
    } catch (err) {
        res.redirect('/users?error=update_failed');
    }
});

// 4. DELETE USER
router.post('/delete/:id', ensureAuthenticated, ensureRole('admin'), async (req, res) => {
    try {
        // Prevent admin from deleting themselves
        if (req.params.id === req.user.id) return res.redirect('/users?error=self_delete');
        
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/users?status=deleted');
    } catch (err) {
        res.redirect('/users?error=delete_failed');
    }
});

module.exports = router;











// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcryptjs');
// const User = require('../models/Users'); // Ensure your path to User model is correct
// const { ensureAuthenticated, ensureRole } = require('../middleware/auth');

// // GET: View all users and the registration form
// router.get('/', ensureAuthenticated, ensureRole('admin'), async (req, res) => {
//     try {
//         const users = await User.find().sort({ role: 1 });
//         res.render('user_managment', { 
//             title: 'User Managment', 
//             users,
//             error: req.query.error,
//             success: req.query.success 
//         });
//     } catch (err) {
//         res.status(500).send("Error loading users.");
//     }
// });

// // POST: Register a new user
// router.post('/register', ensureAuthenticated, ensureRole('admin'), async (req, res) => {
//     try {
//         const { username, password, role, branch } = req.body;

//         // Check if user already exists
//         let user = await User.findOne({ username });
//         if (user) return res.redirect('/users?error=UserExists');

//         const newUser = new User({ username, password, role, branch });

//         // Hash password
//         const salt = await bcrypt.genSalt(10);
//         newUser.password = await bcrypt.hash(password, salt);

//         await newUser.save();
//         res.redirect('/users?success=UserCreated');
//     } catch (err) {
//         res.redirect('/users?error=RegistrationFailed');
//     }
// });

// // POST: Delete a user
// router.post('/delete/:id', ensureAuthenticated, ensureRole('admin'), async (req, res) => {
//     try {
//         // Prevent admin from deleting themselves
//         if (req.params.id === req.user.id) {
//             return res.redirect('/users?error=CannotDeleteSelf');
//         }
//         await User.findByIdAndDelete(req.params.id);
//         res.redirect('/users?success=UserDeleted');
//     } catch (err) {
//         res.redirect('/users?error=DeleteFailed');
//     }
// });

// module.exports = router;