var express   = require('express');
var hash      = require('password-hash');
var mongoose  = require('mongoose');
var User      = mongoose.model('User');
mongoose.Promise = require('bluebird');
var diuitauth = require('diuit-auth');
var config    = require('../config');
var router    = express.Router();

var client = {
  'appId': config.appid,
  'appKey': config.appkey,
  'encryptionKeyId': config.keyid,
  'encryptionKey': config.privatekey.replace(/\\n/g, '\n'),
  'exp' : 60*60*24*7,
  'platform': config.platformtype
};

/* user sign up */
router.post('/signup', function(req, res, next) {
  const spec = req.body;

  client.userSerial = "user." + spec.username;
  client.deviceSerial = client.userSerial +  ".device.0";

  var promise = User.findOne({username: spec.username}).exec();
  promise.then(function(user) {
    if (user != null) {
      throw new Error("user existed");
    }

    return diuitauth.getSessionToken(client);
  }).then(function(resp){
    console.log("get session from Diuit API server:" + resp.session);
    // hash password
    spec.password = hash.generate(spec.password);
    spec.session = resp.session;
    var sessionExpiredDate = new Date();
    sessionExpiredDate.setDate(sessionExpiredDate.getDate() + 7);

    return new User({
        "username": spec.username,
        "password": spec.password,
        "session_token": spec.session,
        "session_expiredAt": sessionExpiredDate
    }).save();
  }).then(function(){
    res.status(200).json({"session":spec.session});
  }).catch(function(error){
    console.log("error:" + error);
    res.status(499).json({"error": error});
  });
});

/* user sign in */
router.post('/signin', function(req, res, next) {
  const spec = req.body;

  var promise = User.findOne({username: spec.username}).exec();
  var resultUser = null;
  promise.then(function(user) {
    if(user == null) {
      throw new Error("user not exist");
    }

    if(!hash.verify(spec.password, user.password)) {
      throw new Error("password mismatch");
    }

    if(user.session_expiredAt > Date.now()) {
      console.log("found user:"+ user);
      res.status(200).json({"session":user.session_token});
    } else {
      resultUser = user;
      console.log("refresh session because it's expired");
      client.userSerial = "user." + spec.username;
      client.deviceSerial = client.userSerial +  ".device.0";

      diuitauth.getSessionToken(client)
      .then(function(resp) {
        console.log("new session token:" + resp.session);
        user.session_token = resp.session;
        var sessionExpiredDate = new Date();
        sessionExpiredDate.setDate(sessionExpiredDate.getDate() + 7);
        user.session_expiredAt = sessionExpiredDate;
        return user.save();
      }).then(function(user) {
        res.status(200).json({"session": resultUser.session_token});
      }).catch(function(error) {
        console.log("error:" + error);
        res.status(499).json({"error":error});
      })
    }
  }).catch(function(error){
    console.log("error:" + error);
    res.status(499).json({"error": error});
  })

});

module.exports = router;
