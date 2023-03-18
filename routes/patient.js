const express = require("express");
const { isAuthenticated } = require("../middlewares/patientAuth");
const upload = require("../middlewares/multer");
const {
  signup,
  login,
  logout,
  editDetails,
  getPatientDetails,
  authorizeDoctor,
  revokeDoctorAccess,
} = require("../controllers/patient");

const {
  addMedicalRecord,
  previewMedicalRecord,
} = require("../controllers/medicalRecord");

const router = express.Router();

router.route("/patient/signup").post(signup);
router.route("/patient/login").post(login);
router.route("/patient/logout").post(isAuthenticated, logout);
router.route("/patient/editDetails").post(isAuthenticated,upload.single("file"), editDetails);
router.route("/patient/getDetails").get(isAuthenticated, getPatientDetails);
router
  .route("/patient/addMedicalRecord")
  .post(isAuthenticated, upload.single("file"), addMedicalRecord);
router
  .route("/patient/previewMedicalRecord")
  .get(isAuthenticated, previewMedicalRecord);
router.route("/patient/authorizeDoctor").post(isAuthenticated, authorizeDoctor);
router
  .route("/patient/revokeDoctorAccess")
  .post(isAuthenticated, revokeDoctorAccess);

module.exports = router;
