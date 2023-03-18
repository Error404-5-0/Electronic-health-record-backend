// const admin = require("firebase-admin");

// const serviceAccount = require("./serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: process.env.BUCKET_URL,
// });

// module.exports = admin.storage().bucket()

const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");
const firebaseConfig = {
  apiKey: "AIzaSyBlVGRnkH1WTzoqiBNzB2uep7A88vInZbc",
  authDomain: "error-electronic-health-record.firebaseapp.com",
  projectId: "error-electronic-health-record",
  storageBucket: "error-electronic-health-record.appspot.com",
  messagingSenderId: "150833338151",
  appId: "1:150833338151:web:c6493c96ecea8611ae3b02",
  measurementId: "G-2YQ925XJ3P",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

module.exports = getStorage(app);
