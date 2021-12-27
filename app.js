require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth");

const app = express();

// CONNECTION
mongoose
  .connect(process.env.DATABASEURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  });

// MIDDLEWARE
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// ROUTES
app.use("/api/backend", authRoutes);

// PORT
const port = process.env.PORT || 8000;

// SERVER STARTING
app.listen(port, () => {
  console.log(`App is Running on port ${port}`);
});
