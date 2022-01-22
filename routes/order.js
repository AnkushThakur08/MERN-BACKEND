const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const { updateStock } = require("../controllers/product");

const { getOrderById } = require("../controllers/order");

// PARAMS
router.param("userId", getUserById);
router.param("orderId", getOrderById);

// ACTUAL ROUTES

// CREATE

// READ

// UPDATE


module.exports = router;
