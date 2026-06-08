require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const connectDB = require("./config/db");
const bcrypt = require("bcryptjs");


// Import Models
const User = require("./models/Users");

const app = express();
const port = process.env.PORT || 3000;

// DATABASE CONNECTION
connectDB();

//  SET UP VIEW ENGINE (PUG)
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//  MIDDLEWARE & STATIC ASSETS
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// SESSION CONFIGURATION
app.use(
  session({
    name: "nyondo.sid",
    secret: process.env.SESSION_SECRET || "NyondoSystemSecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 Hours
      secure: false,
    },
  }),
);

//  PASSPORT CONFIGURATION
app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: "Invalid Email" });

        // Simple password check (Note: In production use bcrypt.compare)
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Invalid Password" });
        }
      } catch (err) {
        return done(err);
      }
    },
  ),
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

//  GLOBAL VIEW VARIABLES
// Injects 'user' into every PUG file so Navbar can see role-based access
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

//  IMPORT ROUTERS
const indexRoutes = require("./routes/indexRoutes");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const stockRoutes = require("./routes/stockRoutes");
const salesRoutes = require("./routes/salesRoutes");
const reportsRoutes = require("./routes/reportsRoutes");
const creditRoutes = require("./routes/suppliercreditRoutes");
const depositsRoutes = require("./routes/depostischemeRoutes");
const slasdashboardRoutes = require("./routes/salesDashboard");
const managerdashboardRoutes = require("./routes/manager_dashboard");
const userRoutes = require('./routes/userRoutes');


// MOUNT ROUTES
app.use("/", indexRoutes);
app.use("/auth", authRoutes); // auth as the base for login/logout

// Core Business Modules
app.use("/dashboard", dashboardRoutes); // Main Dashboard (Admin )
app.use("/stock", stockRoutes); // Inventory Control
app.use("/sales", salesRoutes); // Transaction Desk
app.use("/register", authRoutes); // Staff Registration (Admin Only)
app.use("/products", productRoutes); // Product Management

// Financial & Secondary Modules
app.use("/reports", reportsRoutes); // reports
app.use("/credit", creditRoutes); // credit Tracking
app.use("/deposits", depositsRoutes); // Savings Schemes
app.use("/sales_dashboard", slasdashboardRoutes); // Sales Dashboard
app.use("/manager_dashboard", managerdashboardRoutes); // Manager Dashboard
app.use('/users', userRoutes);

//  HELPER ROUTES
app.get("/transport", (req, res) => {
  res.render("layout", { title: "Transport Logs" });
});

//  ERROR HANDLING (404 Page)
app.use((req, res) => {
  res.status(404).render("layout", {
    title: "404 - Page Not Found",
    error: "The requested Nyondo System module was not found.",
  });
});

//  START SERVER
app.listen(port, () => {
  console.log(`-----------------------------------------------`);
  console.log(` NYONDOSTOCK SYSTEM IS LIVE`);
  console.log(` URL: http://localhost:${port}`);
  console.log(` Status: Online - ${new Date().toLocaleTimeString()}`);
  console.log(`-----------------------------------------------`);
});
