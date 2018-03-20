var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Form = require('../models/form');
const { check, validationResult } = require('express-validator/check');



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
          form.usuario.id = req.user._id;
          form.usuario.nome = req.user.username;
          form.save();
          user.forms = form._id;
          user.save();
          req.flash("success", "Obrigado pela colaboração! :)");
          res.redirect('/')
        }
      })
    }
  })

});

router.get('/form/final',isLoggedIn, DidntFill, function(req,res){
  User.findOne({_id: req.user._id}).populate('forms').exec(function(err,user){
    if(err){
      console.log(err);
      res.redirect('/form')
    } else {
      res.render('final', {user:user})
    }
  })

})


function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "Por favor Entre primeiro!")
  res.redirect('/login');
};
function AlreadyFilled(req,res,next){
  if(!req.user.forms){
    return next();
  } else{
    res.redirect('/form/final')
  }

};
function DidntFill(req,res,next){
  if(!req.user.forms) {
    req.flash('error', "Você precisa preencher o formulario primeiro!")
    res.redirect('/form');
  } else {
    return next();
  }
}


function Validate(req,res,next) {
  let form = req.body.form;
  console.log(form);
  // Object.keys(form).forEach(function(input){
  //   console.log(input);
  // })
  return next;
}


module.exports = router;
