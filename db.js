var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
var config    = require('./config');
var Promise   = require('bluebird');
var diuitauth = require('diuit-auth');
var hash      = require('password-hash');

// user schema
var User = new Schema({
  username : { type: String, lowercase: true, unique: true },
  password: String,
  session_token: String,
  session_expiredAt: Date
},
{
  timestamps: true
});

var client = {
  'appId': config.appid,
  'appKey': config.appkey,
  'encryptionKeyId': config.keyid,
  'encryptionKey': config.privatekey.replace(/\\n/g, '\n'),
  'exp' : 60*60*24*7,
  'platform': config.platformtype
};

// Model Static Method
User.statics.signup = function (username, password) {
  return new Promise((resolve, reject) => {
    return this.findOne({ username: username }).then(function (user) {
      if (user) {
        reject("user existed");
      } else {
        client.userSerial =  username;
        client.deviceSerial = client.userSerial +  ".device.0";
        return diuitauth.getSessionToken(client)
      }
    }).then(function (resp) {
      let sessionExpiredDate = new Date();
      sessionExpiredDate.setDate(sessionExpiredDate.getDate() + 7);
      let passwd = hash.generate(password);
      let session  = resp.session;
      resolve({
        "username": username,
        "password": passwd,
        "session_token": session,
        "session_expiredAt": sessionExpiredDate
      })
    }).catch(function (e) {
      reject(e)
    })
  })
}

User.statics.signin = function (username, password) {
  return new Promise((resolve, reject) => {
    let userObj = null;
    return this.findOne({username: username}).then(function (user) {
      if (!user) {
        reject("user not exist")
      }
      if (!hash.verify(password, user.password)) {
        reject("password mismatch")
      }
      // return session_token if session not expired
      if (user.session_expiredAt > Date.now()) {
        console.log(user.session_expiredAt)
        resolve(user)
      } else {
        userObj = user
        client.userSerial = username;
        client.deviceSerial = client.userSerial +  ".device.0";
        return diuitauth.getSessionToken(client)
      }
    }).then(function (resp) {
      console.log(resp)
      let sessionExpiredDate = new Date();
      sessionExpiredDate.setDate(sessionExpiredDate.getDate() + 7);
      userObj.session_token     = resp.session;
      userObj.session_expiredAt = sessionExpiredDate;
      return userObj.save();
    }).then(function (user) {
      resolve(user);
    }).catch(function (e) {
      reject(e)
    })
  })
}

//use schema create a module, means create an model named 'User'
module.exports = mongoose.model('User', User);
//connect db
// mongoose.connect(config.dburi);
