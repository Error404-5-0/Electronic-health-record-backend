const Doctor = require("../models/doctor");
const { getUrl, upload } = require("../utils/storage");

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let doctor = await Doctor.findOne({ email });
    console.log(doctor);

    if (doctor) {
      return res.status(400).json({
        success: false,
        message: "Doctor already exixts",
      });
    }
    doctor = await Doctor.create({
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

    let doctor = await Doctor.findOne({ email }).select("+password");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const isMatch = await doctor.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({
        status: false,
        message: "Incorrect credentials",
      });
    }

    const token = doctor.generateToken();

    const options = {
       httpOnly: true,
       secure: true,
       sameSite: 'none',
    };

    return res.status(200).cookie("doctorToken", token, options).json({
      success: true,
      message: "Logged in successfully",
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
    res.status(200).clearCookie("doctorToken").json({
      success: true,
      message: "Logged out",
    });
  } catch (error) {
    res.status(500).json({
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
      await Doctor.updateOne(
        { email: req.doctor.email },
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

exports.getDoctorDetails = async (req, res) => {
  try {
    if (!req.doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    const doctor = await req.doctor.populate("patients");

    if (doctor.profileImage !== "") {
      doctor.profileImage = await getUrl(doctor.profileImage);
    }

    return res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();

    if (!doctors) {
      return res.status(404).json({
        success: false,
        message: "No Doctors available",
      });
    }

    return res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
