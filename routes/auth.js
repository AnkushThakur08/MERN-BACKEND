const express = require("express");
const router = express.Router();
const { check, body, validationResult } = require("express-validator");

const { signout, signup, signin, isSignedIn } = require("../controllers/auth");

// TODO: SIGNUP POST Route
router.post(
  "/signup",
  [
    check("name")
      .isLength({ min: 3 })
      .withMessage("Name must have 3 Characters"),
    check("email", "Email is Required").isEmail(),
    check("password")
      .isLength({ min: 4 })
      .withMessage("Password should be atleast of 4 Characters"),
  ],
  signup
);

// TODO: SIGNIN POST Route
router.post(
  "/signin",
  [
    check("email").isEmail().withMessage("Email is Required"),
    check("password")
      .isLength({ min: 1 })
      .withMessage("Password Field Required"),
  ],
  signin
);

// TODO: SIGNOUT GET ROUTE
router.get("/signout", signout);

router.get("/testRoute", isSignedIn, (req, res) => {
  res.json(req.auth);
});

module.exports = router;
