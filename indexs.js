// 1.Dependencies
const express = require('express');
const expressSession = require('express-session');
const path = require('path');




// 2.Instantiations
const app = express();
const PORT = 3000;




// 3.Configurations
// set



// 4.Middleware
// To parse URL encoded datanpm

app.use(express.urlencoded({ extended: false }));
app.use(expressSession({
  secret: "My Secret",
  resave: false,
  saveUninitialized: false
}));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// 4.Middleware for static files (CSS, JS, Images)
app.use(express.static(path.join(__dirname, 'Public'))); 

// Simple request time logger
app.use('/about',(req, res, next) => {
   console.log("A new request received at " + Date.now());


   // This function call tells that more processing is
   // required for the current request and is in the next middleware
  //  function /route handler.
   next();  
})

// 5.Routes




// 6.
// Route 1: The Home Page (http://localhost:3000)
// app.get('/', (req, res) => { 
  // res.send('Zechariah 4:6 (NIV) ... Not by might nor by power but by my Spirit says the Lord Almighty.');
// });

app.get('/greet', (req, res) => {
  // This looks at the URL for "?name=Something"
  const userName = req.query.name || "Friend"; 

  res.send(`
    <h1 style="color: blue;">Hello, ${userName}!</h1>
    <p>The Holy Spirit is working through this code.</p>
    <a href="/">Go back home</a>
  `);
});

// Route 2: The About Page (http://localhost:3000/about)
// strusture of a route
// Changed from '/' to '/about' so it has its own unique address
// app.method(Path, handler)


app.get('/about', (req, res) => { 
  res.send('<h1>All About Me</h1><p>This is my first Node.js server!</p>');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/html/index.html');
});


app.get('/sales', (req, res) => {
  res.sendFile(__dirname + '/html/sales.html');
});

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/html/register.html');
});

app.post('/register', (req, res) => {
  console.log(req.body);
})


app.post('/quotes', (req, res) => {
  res.send("you are saved by christ")
})


app.post('/coding',(req, res) => {
  res.send("This is my first code")
})


app.get("/hobbies", (req, res) => {
  res.send("About me! I am passionate about transforming lives of youth from tec ")
})

app.put('/Mosaci',(req, res) => {
  res.send("Spirit Led Spirit Empowered")
})

app.delete('/Zosai',(req, res) => {
  res.send("Unfailing God")
})


// PATH PARAMETERS
app.get('/Students/:firstname',(req, res) => {
  res.send('My first name is ' + req.params.firstname);
})
// querry parameters
app.get('/dog/:Origin',(req, res) => {
  res.send('Am lookig for dog from ' + req.params.Origin + ' which is a ' + req.query.breed + ' and is ' + req.query.color + ' in color');
})

app.get('/dog',(req, res) => {
  res.send('Am lookig for dog from ' + req.query.Origin + ' which is a ' + req.query.breed + ' and is ' + req.query.color + ' in color');
})

// Serving HTML files
// app.get('/index', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });


// always second last code block
// Handling non
app.use((req, res) => {

res.status(404).send('Oops! Route not found.');

});

// 6.Bootstrapping Server
// The server listener is yje last line of code in the file
app.listen(PORT, () => console.log('listening on port ' + PORT));