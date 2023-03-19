const Patient = require("../models/patient");
const Doctor = require("../models/doctor");
const { getUrl, upload } = require("../utils/storage");

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let patient = await Patient.findOne({ email });

    if (patient) {
      return res.status(400).json({
        success: false,
        message: "Patient already exixts",
      });
    }
    patient = await Patient.create({
      name,
      email,
      password,
      medicalRecords: [],
    });

    return res.status(200).json({
      success: true,
      data: "Account created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let patient = await Patient.findOne({ email }).select("+password");

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const isMatch = await patient.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({
        status: false,
        message: "Incorrect credentials",
      });
    }

    const token = patient.generateToken();

    const options = {
      // httpOnly: true,
      // secure: true,
    };

    return res.status(200).cookie("patientToken", token, options).json({
      success: true,
      data: "Logged in successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    return res.status(200).clearCookie("patientToken").json({
      success: true,
      message: "Logged out",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.editDetails = async (req, res) => {
  try {
    let details = req.body;
    if (req.file) {
      const filePath = await upload("profilePics", req.file);
      details = { ...details, profileImage: filePath };
    }

    let addedDetails = (
      await Patient.updateOne(
        { email: req.patient.email },
        {
          $set: details,
        }
      )
    ).acknowledged;

    if (!addedDetails) {
      return res.status(403).json({
        success: false,
        message: "An error occured",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Details added",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPatientDetails = async (req, res) => {
  try {
    if (!req.patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    let patient = await req.patient.populate("medicalRecords");

    if (patient.profileImage !== "") {
      patient.profileImage = await getUrl(patient.profileImage);
    }

    return res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.authorizeDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const doctor = await Doctor.findById(doctorId);

    if (doctor.patients.includes(req.patient._id)) {
      return res.status(403).json({
        success: false,
        message: "Access already granted",
      });
    }

    doctor.patients.push(req.patient._id);
    await doctor.save();

    return res.status(200).json({
      success: true,
      message: "Access granted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.revokeDoctorAccess = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const doctor = await Doctor.findById(doctorId);

    if (!doctor.patients.includes(req.patient._id)) {
      return res.status(403).json({
        success: false,
        message: "Doctor does not have access",
      });
    }

    doctor.patients.splice(doctor.patients.indexOf(req.patient._id), 1);
    await doctor.save();

    return res.status(200).json({
      success: true,
      message: "Access revoked",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
