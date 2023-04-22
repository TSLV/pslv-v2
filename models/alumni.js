const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  age:{
    type: Number,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  institute:{
    type: String,
    required: true,
  },
  joinYear: {
    type: Number,
    required: true,
  },
  passYear: {
    type: Number,
    required: true,
  },
  bio:{
    type: String,
  },
  workplace: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = mongoose.model("Alumni", studentSchema);

// address: {
//   type: Schema.Types.ObjectId,
//   required: true,
//   ref: "Address",
// },
// institute: {
//   type: Schema.Types.ObjectId,
//   required: true,
//   ref: "Institute-List",
// },
// contact: {
//   type: Schema.Types.ObjectId,
//   required: true,
//   ref: "Contact",
// },