var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
// ROOT ROUTE
router.get('/',function(req,res){
  res.render('index');
});

//AUTH ROUTES
router.get('/register', function(req,res){
  res.render('register');
})
router.get('/privacy', function(req,res){
  res.render('privacy');
});

router.post('/register', function(req,res){
  var newUser =new User({username:req.body.username});
  User.register(newUser, req.body.password, function(err,user){
    if(err){
      console.log(err);
      return res.render('register');
    }
    passport.authenticate('local')(req,res, function(){
      res.redirect('/form');
    });
  });
});

router.get('/login', function(req,res){
  res.render('login')
});


//Google Routes
router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile']
}));


//Callback Route for Google
router.get('/auth/google/redirect', passport.authenticate('google'), (req,res) => {
  req.flash("success", "Seja Bem Vindo !");
  res.redirect('/form')
} );
//End Google ROutes

//Facebook Routes
router.get('/auth/facebook',
  passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login', failureFlash: 'Algo deu errado!' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/form');
  });
//End Facebook Routes

router.post('/login',passport.authenticate('local',
{
  successRedirect: '/form',
  failureRedirect: '/login'}), function(req,res){
});

router.get('/logout', function(req,res){
  req.logout();
  req.flash("success", "Você saiu!")
  res.redirect('/')
})



function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "Por Favor entre primeiro!");
  res.redirect('/login');
};

module.exports = router;
