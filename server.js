require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Import User Model for Passport
const User = require('./models/Users'); 

const app = express();
const port = process.env.PORT || 3000;

// 1. DATABASE CONNECTION
mongoose.connect('mongodb://localhost:27017/nyondoStock', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log(' Connected to MongoDB: Nyondo System'))
  .catch(err => console.error(' MongoDB Connection Error:', err));

// 2. SET UP VIEW ENGINE (PUG)
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 3. MIDDLEWARE & STATIC ASSETS
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 4. SESSION CONFIGURATION (Must come BEFORE Passport)
app.use(session({
    name: 'nyondo.sid',
    secret: process.env.SESSION_SECRET || 'NyondoSystem,',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24, 
        secure: false 
    }
}));

// 5. PASSPORT CONFIGURATION
app.use(passport.initialize());
app.use(passport.session());

// Passport Strategy
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: 'Invalid Email' });
        // In production, use bcrypt.compare(password, user.password)
        if (user.password !== password) return done(null, false, { message: 'Invalid Password' });
        return done(null, user);
    } catch (err) { return done(err); }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) { done(err); }
});

// 6. GLOBAL VIEW VARIABLES
app.use((req, res, next) => {
    res.locals.user = req.user || null; // Passport sets req.user
    next();
});

// 7. IMPORT ROUTERS
const indexRoutes = require('./routes/indexRoutes');
const loginRouter = require('./routes/authRoutes'); 
const registerRouter = require('./routes/registerRoutes');
const dashboardRouter = require('./routes/dashboardRoutes');
const stockRouter = require('./routes/stockRoutes');
const salesRouter = require('./routes/salesRoutes');
const reportsRouter = require('./routes/reportsRoutes');
const creditRouter = require('./routes/suppliercreditRoutes'); 
const depositsRouter = require('./routes/depostischemeRoutes');

// 8. MOUNT ROUTES
app.use('/', indexRoutes);            
app.use('/auth', loginRoutes);        
app.use('/register', registerRoutes); 
app.use('/dashboard', dashboardRoutes); 
app.use('/stock', stockRoutes);       
app.use('/sales', salesRoutes);       
app.use('/reports', reportsRoutes);   
app.use('/credit', creditRoutes);     
app.use('/deposits', depositsRoutes); 

// 9. ERROR HANDLING (404 Page)
app.use((req, res) => {         
    res.status(404).render('layout', { 
        title: '404 - Page Not Found',
        error: 'The requested Nyondo System module was not found.' 
    });
});

// 10. START SERVER
app.listen(port, () => {
    console.log(`-----------------------------------------------`);
    console.log(`  NYONDOSTOCK SYSTEM IS LIVE`);
    console.log(`  URL: http://localhost:${port}`);
    console.log(`  Status: Online - ${new Date().toLocaleTimeString()}`);
    console.log(`-----------------------------------------------`);
});