require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// My Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const stripeRoutes = require("./routes/stripePayment");
const paypalRoutes = require("./routes/paypalPayment");

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
app.use("/api/backend", userRoutes);
app.use("/api/backend", categoryRoutes);
app.use("/api/backend", productRoutes);
app.use("/api/backend", orderRoutes);
app.use("/api/backend", stripeRoutes);
app.use("/api/backend", paypalRoutes);

// PORT
const port = process.env.PORT || 8000;

// SERVER STARTING
app.listen(port, () => {
  console.log(`App is Running on port ${port}`);
});
