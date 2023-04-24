const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const jobSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  companyname: {
    type: String,
    required: true,
  },
  description:{
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
    required: true,
  },
  skills: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Alumni",
  },
});

module.exports = mongoose.model("Job", jobSchema);
