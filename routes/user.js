const express = require("express");
const router = express.Router();

const {
  getUserById,
  getUser,
  updateUser,
  userPurchaseList,
} = require("../controllers/user");

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

// Parameter Extactor
router.param("userId", getUserById);

// GET USER Route
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);

// PUT USER Route
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);

// GET USER ORDER
router.get(
  "/user/orders/:userId",
  isSignedIn,
  isAuthenticated,
  userPurchaseList
);
module.exports = router;
