var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
//schema model entity
//schema like a skeleton,defined all collection(table) the field(column)
//model(class) like a pattern made by schema (rules,module)
//use model to build a entity(instance)
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
//using test db
mongoose.connect('mongodb://localhost/dudemo');
