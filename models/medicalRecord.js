const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter a title"],
  },
  symptoms: {
    type: String,
    required: [true, "Please enter symptoms"],
  },
  date: {
    type: mongoose.Schema.Types.Date,
    required: [true, "Please enter date"],
  },
  filePath: {
    type: String,
    required: [true, "Please enter a file path email"],
  },
});

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);
