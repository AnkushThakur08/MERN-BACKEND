const User = require("../models/user");

exports.signup = (req, res) => {
  console.log("REQ BODY", req.body);
  res.json({
    message: "Signup Route Works!",
  });
};

exports.signout = (req, res) => {
  res.json({
    user: "message",
  });
};
