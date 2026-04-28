const express = require('express');
const path = require('path');

require('dotenv').config();
const mongoose = require('mongoose');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 3000;

// 1. DATABASE CONNECTION (MongoDB)
// Connects to the local NyondoStock database
mongoose.connect('mongodb://localhost:27017/nyondoStock', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB: Nyondo System'))
  .catch(err => console.error(' MongoDB Connection Error:', err));

// 2. SET UP VIEW ENGINE (PUG)
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 3. MIDDLEWARE & STATIC ASSETS
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 4. SESSION CONFIGURATION
// Essential for Login/Logout and Role-Based Redirection
app.use(session({
    name: 'nyondo.sid',
    secret: 'NyondoCyberGlowSecret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24, // Session valid for 24 hours
        secure: false // Set to true only if using HTTPS
    }
}));

// 5. GLOBAL VIEW VARIABLES
// Injects the 'user' object into every .pug file automatically
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// 6. IMPORT ROUTERS
const indexRoutes = require('./routes/indexRoutes');
const loginRouter = require('./routes/loginRoutes'); 
const registerRouter = require('./routes/registerRoutes');
const dashboardRouter = require('./routes/dashboardRoutes');
const stockRouter = require('./routes/stockRoutes');
const salesRouter = require('./routes/salesRoutes');
const reportsRouter = require('./routes/reportsRoutes');
const creditRouter = require('./routes/suppliercreditRoutes'); 
const depositsRouter = require('./routes/depostischemeRoutes');
const layoutRoutes = require('./routes/layoutRoutes');


// 7. MOUNT ROUTES
// Public System Entry Points
app.use('/', indexRoutes);            // Welcome Landing Page
app.use('/auth', loginRouters);        // Login & Logout Logic

// app.use('/', layoutRoutes);// This must be placed BEFORE other functional routes to ensure layout.pug has access to the 'user' variable on all pages

// Core Business Modules
app.use('/register', registerRoutes); // Admin: Staff Registration
app.use('/dashboard', dashboardRoutes); // Manager/Admin: Overview
app.use('/stock', stockRoutes);       // Manager/Admin: Inventory Control
app.use('/sales', salesRoutes);       // Attendant/Manager: Transaction Desk

// Financial & Secondary Modules
app.use('/reports', reportsRoutes);   // Manager/Admin: Analytics
app.use('/credit', creditRoutes);     // Debt & Credit Tracking
app.use('/deposits', depositsRoutes); // Savings/Deposit Schemes

// 8. HELPER ROUTES 
// app.get('/transport', (req, res) => {
//     res.render('layout', { title: 'Transport Logs' });
// });

// 9. ERROR HANDLING (404 Page)
// Catches all undefined routes and displays a themed error page
app.use((req, res) => {
    res.status(404).render('layout', { 
        title: '404 - Page Not Found',
        error: 'The requested Nyondo System module was not found.' 
    });
});

// 10. START SERVER
app.listen(port, () => {
    console.log(`-----------------------------------------------`);
    console.log(` NYONDOSTOCK SYSTEM IS LIVE`);
    console.log(` URL: http://localhost:${port}`);
    console.log(` Status: Online - ${new Date().toLocaleTimeString()}`);
    console.log(` Database: MongoDB Localhost`);
    console.log(`-----------------------------------------------`);
});