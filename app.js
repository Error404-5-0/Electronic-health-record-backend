const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: "*" }));

require("dotenv").config({ path: ".env" });

// const user = require("./routes/user");
// const restaurant = require("./routes/restaurant");
// const product = require("./routes/product");

// app.use("/api", user);
// app.use("/api", restaurant);
// app.use("/api", product);

module.exports = app;
