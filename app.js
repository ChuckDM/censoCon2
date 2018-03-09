var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Form = require('./models/form')
var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('./models/user');

var indexRoutes = require('./routes/index');
var formRoutes = require('./routes/form');

// Express Sessions Setup
app.use(require('express-session')({
  secret: "Tesla fucking rocks",
  resave: false,
  saveUninitialized: false
}));
//Passport Init
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Mongoose Connect
mongoose.connect('mongodb://localhost/censodm');

//View Engine and Static Folder
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));


app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  next();
})


app.use(formRoutes);
app.use(indexRoutes);

// SINKHOLE ROUTE
app.get('*', function(req,res){
  res.render('notfound');
});
var port = 3000;

app.listen(port,function(){
    console.log('Our app is running on http://localhost:' + port);
})
