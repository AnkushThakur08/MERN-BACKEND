const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const { updateStock } = require("../controllers/product");

const {
  getOrderById,
  createOrder,
  getAllOrders,
} = require("../controllers/order");

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
router.get(
  "/order/allOrder/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getAllOrders
);

// UPDATE

module.exports = router;
