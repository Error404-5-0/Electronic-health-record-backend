const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const patientSchema = new mongoose.Schema({
  profileImage: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    required: [true, "Please enter a name"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    select: false,
  },
  medicalRecords: [
    { type: mongoose.Schema.Types.ObjectId, ref: "MedicalRecord" },
  ],
  age: {
    type: String,
    default: "",
  },
  bloodGroup: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    default: "",
  },
  height: {
    type: String,
    default: "",
  },
  weight: {
    type: String,
    default: "",
  },
});

patientSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

patientSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

patientSchema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};

module.exports = mongoose.model("Patient", patientSchema);
