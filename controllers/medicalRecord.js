const { ref, getDownloadURL } = require("firebase/storage");
const storage = require("../config/firebase");
const { upload, getUrl } = require("../utils/storage");
const MedicalRecord = require("../models/medicalRecord");

exports.addMedicalRecord = async (req, res) => {
  try {
    const filePath = await upload("medicalRecords", req.file);
    const { title, date, symptoms } = req.body;

    const medicalRecord = await MedicalRecord.create({
      filePath,
      title,
      date,
      symptoms,
    });
    req.patient.medicalRecords.push(medicalRecord._id);
    await req.patient.save();

    return res.status(200).json({
      success: true,
      data: medicalRecord,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.previewMedicalRecord = async (req, res) => {
  try {
    const { id } = req.query;
    const { filePath } = await MedicalRecord.findById(id);
    const storageRef = ref(storage, filePath);
    const downloadUrl = await getDownloadURL(storageRef);
    return res.status(200).json({
      success: true,
      data: downloadUrl,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteMedicalRecord = async (req, res) => {
  try {
    const { id } = req.query;

    const recordDeleted = (await MedicalRecord.deleteOne({ _id: id }))
      .acknowledged;

    if (!recordDeleted) {
      return res.status(403).json({
        success: true,
        message: "An error occurred",
      });
    }
    req.user.medicalRecords.splice(index, 1);
    await req.user.save();

    return res.status(200).json({
      success: true,
      message: "Medical Record deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
