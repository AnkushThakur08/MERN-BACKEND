const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const { updateStock } = require("../controllers/product");

const { getOrderById, createOrder } = require("../controllers/order");

// PARAMS
router.param("userId", getUserById);
router.param("orderId", getOrderById);

// ACTUAL ROUTES
// CREATE
router.post(
  "/order/create/:userId",
  isSignedIn,
  isAuthenticated,
  pushOrderInPurchaseList,
  updateStock,
  createOrder
);

// READ

// UPDATE

module.exports = router;
