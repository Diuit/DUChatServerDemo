var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var config    = require('./config');

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
//use schema create a module, means create an model named 'User'
mongoose.model('User', User);
//connect db
mongoose.connect(config.dburi);
