var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');


var UserSchema = new mongoose.Schema({
  username: String,
  googleId: String,
  password: String,
  facebookId: String,
  forms: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form"
  }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
