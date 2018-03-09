var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Form = require('../models/form');


// FORM ROUTE
router.get('/form', isLoggedIn, AlreadyFilled, function(req,res){
    res.render('form');
});

// FORM POST ROUTE
router.post('/form', isLoggedIn, function(req,res){
  User.findById(req.user._id,function(err,user){
    if(err){
      console.log(err);
      res.redirect('/form');
    } else {
      Form.create(req.body.form,function(err,form){
        if(err){
          console.log(err);
        } else {
          //add username and id to comment
          form.usuario.id = req.user._id;
          form.usuario.nome = req.user.username;
          //save comment
          form.save();
          user.forms = form._id;
          user.save();
          console.log(user.forms);
          res.redirect('/')
        }
      })
    }
  })
});

router.get('/form/final', function(req,res){
  User.findOne({_id: req.user._id}).populate('forms').exec(function(err,user){
    if(err){
      console.log(err);
    } else {
      res.render('final', {user:user})
    }
  })

})


function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
};
function AlreadyFilled(req,res,next){
  if(!req.user.forms){
    return next();
  } else{
    res.redirect('/form/final')
  }

};

module.exports = router;
