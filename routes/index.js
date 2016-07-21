var express   = require('express');
var hash      = require('password-hash');
var mongoose  = require('mongoose');
// var User      = mongoose.model('User');
var User = require('../db')
mongoose.Promise = require('bluebird');
var config    = require('../config');
var router    = express.Router();

var ROUTES = {
  SIGNUP: '/signup'
  , SIGNIN: '/signin'
}

router.post(ROUTES.SIGNUP, function(req, res, next) {
  req.checkBody('username', 'Invalid username').notEmpty();
  req.checkBody('password', 'Invalid password').notEmpty();
  console.log(req.body.password)
  if (err = req.validationErrors()) {
    res.status(400).send(err)
    return
  }
  let username = req.body.username;
  let password = req.body.password;
  User.signup(username, password).then(function (result) {
    let user = new User(result)
    return user.save()
  }).then(function (user) {
    console.log(user.session_token)
    res.status(200).json({session: user.session_token})
  }).catch(function (e) {
    console.log(e)
    res.status(499).json({error: e})
  })
})

/* user sign in */
router.post(ROUTES.SIGNIN, function(req, res, next) {
  req.checkBody('username', 'Invalid username').notEmpty();
  req.checkBody('password', 'Invalid password').notEmpty();
  if (err = req.validationErrors()) {
    res.status(400).send(err)
    return
  }
  let username = req.body.username;
  let password = req.body.password;

  User.signin(username, password).then(function (user) {
    res.status(200).json({session: user.session_token})
  }).catch(function (e) {
    console.log(e);
    res.status(499).json({error : e});
  })
});

module.exports = router;
