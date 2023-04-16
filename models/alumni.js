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
  dob: {
    type: Date,
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
  address: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Address",
  },
  institute: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Institute",
  },
  workplace: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  contact: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Contact",
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = mongoose.model("Institute", studentSchema);
