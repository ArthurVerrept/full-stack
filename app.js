const express = require('express');
var handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');


const app = express();

app.use(express.static('public'));

// passport config
require('./config/passport')(passport);

// db config
const db = require('./config/keys').MongoURI;

// connect to mongo
mongoose.connect(db, {useUnifiedTopology: true, useNewUrlParser: true})
.then(()=> console.log('mongodb connected'))
.catch(err=>console.log(err))

// HandleBars
app.set('view engine', 'hbs');
app.engine('hbs', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs'
}));

// body parser
app.use(express.urlencoded({extended: false}));

// express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());


// connect flash
app.use(flash())

// creating global flash variables
app.use((req,res,next) =>  {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

// Routes
// if endpoint is / then got to route
app.use('/', require('./routes/welcome.js'))

// users route
app.use('/users', require('./routes/users'))

// dashboard route
app.use('/dashboard', require('./routes/dashboard'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`app listening on port ${PORT}`));
