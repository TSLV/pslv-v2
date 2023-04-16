const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role:{
    type: String,
    required: true,
  }
});

userSchema.methods.addRole = function(role) {
  this.role = role;
  return this.save();
}

module.exports = mongoose.model("User", userSchema);
