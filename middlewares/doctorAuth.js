const Doctor = require("../models/doctor");
const Patient = require("../models/patient");
const jwt = require("jsonwebtoken");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const { doctorToken } = req.cookies;

    if (!doctorToken) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const decoded = jwt.verify(doctorToken, process.env.JWT_SECRET);

    req.doctor = await Doctor.findById(decoded._id);

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.hasRecordAccess = async (req, res, next) => {
  try {
    const { patientId } = req.query;
    if (!req.doctor.patients.includes(patientId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to access patient",
      });
    }

    req.patient = await Patient.findById(patientId);

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
