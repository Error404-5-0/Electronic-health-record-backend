const express = require("express");
const upload = require("../middlewares/multer");
const {
  isAuthenticated,
  hasRecordAccess,
} = require("../middlewares/doctorAuth");
const {
  signup,
  login,
  logout,
  editDetails,
  getDoctorDetails,
} = require("../controllers/doctor");
const { getPatientDetails } = require("../controllers/patient");
const { previewMedicalRecord } = require("../controllers/medicalRecord");

const router = express.Router();

router.route("/doctor/signup").post(signup);
router.route("/doctor/login").post(login);
router.route("/doctor/logout").post(isAuthenticated, logout);
router
  .route("/doctor/editDetails")
  .post(isAuthenticated, upload.single("file"), editDetails);
router.route("/doctor/getDetails").get(isAuthenticated, getDoctorDetails);
router
  .route("/doctor/getPatientDetails")
  .get(isAuthenticated, hasRecordAccess, getPatientDetails);

router
  .route("/doctor/previewMedicalRecord")
  .get(isAuthenticated, previewMedicalRecord);

module.exports = router;
