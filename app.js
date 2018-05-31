const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
// const flash = require('express-flash-2');
const mongoose = require('mongoose');

const app = express();

// LOAD ROUTES
const notes = require('./routes/notes');
const users = require('./routes/users');

// Passport Config

require('./config/passport')(passport);


const port = process.env.PORT || 5000;

// connect to mongoose
mongoose.Promise = global.Promise
mongoose.connect('mongodb://jee:jee@ds159489.mlab.com:59489/nodetest')
    .then(() => console.log('MongoDb Connected...'))
    .catch(err => console.log(err))

// Handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

// EXPRESS SESSION MIDDLEWARE
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));
app.use(flash())
// PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

//   GLOBAL VARIABLES
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    console.log('mydata', res.locals.success_msg)
    next();
});

// for static files (css,js)
// app.use(express.static('assets'))
app.use(express.static(path.join(__dirname, 'public')));
app.use('/notes/add', express.static(path.join(__dirname, 'public')));
app.use('/notes/edit', express.static(path.join(__dirname, 'public')));
app.use('/users', express.static(path.join(__dirname, 'public')));

// INDEX PAGE
app.get('/', (req, res) => {
    const title = "Welcome,bro"
    res.render('index', {
        title: title
    });
})

// ABOUT PAGE
app.get('/about', (req, res) => {
    res.render('about');
});
// User Routes
app.use('/notes', notes)
app.use('/users', users)

app.listen(port, () => {
    console.log(`Server starting on ${port}`);
});