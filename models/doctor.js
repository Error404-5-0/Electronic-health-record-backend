const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const doctorSchema = new mongoose.Schema({
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

  rating: {
    type: mongoose.Schema.Types.Decimal128,
    default: 0,
  },

  age: {
    type: String,
    default: "",
  },

  gender: {
    type: String,
    default: "",
  },

  experience: {
    type: String,
    default: "",
  },

  degree: {
    type: String,
    default: "",
  },
  patients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
  ],
});

doctorSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

doctorSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

doctorSchema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};

module.exports = mongoose.model("Doctor", doctorSchema);
