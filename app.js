const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: "*" }));

require("dotenv").config({ path: ".env" });

const patient = require("./routes/patient");
const doctor = require("./routes/doctor");

app.use("/api", patient);
app.use("/api", doctor);

module.exports = app;
