const User = require("../models/user");
const { check, body, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");
// const read = require("body-parser/lib/read");

exports.signup = (req, res) => {
  /*  console.log("REQ BODY", req.body);
  res.json({
    message: "Signup Route Works!",
  }); */

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      parameter: errors.array()[0].param,
    });
  }

  const user  = new User(req.body);
  user.save((error, user) => {
    if (error) {
      return res.status(400).json({
        error: "Unable to Save user in the DB",
      });
    }

    // res.json(user);

    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      parameter: errors.array()[0].param,
    });
  }

  User.findOne({ email }, (error, user) => {
    if (error || !user) {
      res.status(400).json({
        error: "User Email does not exists",
      });
    }

    if (!user.autheticate(password)) {
      return res.status(401).json({
        error: "Email & Password do not match",
      });
    }

    // Create a Token
    var token = jwt.sign({ _id: user._id }, process.env.SECRET);

    // Put token into cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    // Sending Response to the front end

    const { _id, name, email, role } = user;

    res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token"); // Clear the cookier whose name is Token
  res.json({
    user: "User Signout Successfully",
  });
};

// Protected Routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
  userProperty: "auth", //This auth contents _id of the user
});

//  Custom Middlwares
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.auth._id == req.profile._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }

  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are NOT ADMIN, ACCESS DENIED",
    });
  }
  next();
};
