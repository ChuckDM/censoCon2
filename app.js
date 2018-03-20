var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Form = require('./models/form')
var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('./models/user');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var keys = require("./keys.js")
var FacebookStrategy = require('passport-facebook').Strategy;
var flash = require('connect-flash');
var https = require('https');
var fs = require('fs');
var sslOptions = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
  passphrase: keys.ssl.passphrase
};

var indexRoutes = require('./routes/index');
var formRoutes = require('./routes/form');

// Express Sessions Setup
app.use(require('express-session')({
  secret: keys.session.secret,
  resave: false,
  saveUninitialized: false
}));
//Passport Init
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


passport.use(new GoogleStrategy({
  callbackURL: "/auth/google/redirect",
  clientID: keys.google.clientID,
  clientSecret: keys.google.clientSecret
}, (accessToken, refreshToken, profile, done) => {
  User.findOne({googleId: profile.id}).then((currentUser) => {
    if(currentUser){
      console.log(currentUser);
      done(null,currentUser);
    } else {
      new User({
        username: profile.displayName,
        googleId: profile.id
      }).save().then((newUser) => {
        console.log("New User created!" + newUser);
        done(null, newUser);
    });
    }
  })
})
)
passport.use(new FacebookStrategy({
    clientID: keys.facebook.clientID,
    clientSecret: keys.facebook.clientSecret,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

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
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
})


app.use(formRoutes);
app.use(indexRoutes);

// SINKHOLE ROUTE
app.get('*', function(req,res){
  res.render('notfound');
});
var port = 3000;


var httpsServer = https.createServer(sslOptions, app);

httpsServer.listen(port,function(){
    console.log('Our app is running on http://localhost:' + port);
})
