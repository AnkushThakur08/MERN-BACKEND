const express = require("express");
const router = express.Router();

const { getProductById, getProduct } = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

// Parameter Extactor
router.param("userId", getUserById);
router.param("productId", getProductById);

// Actual routes
router.get("/product/:productId", getProduct);

module.exports = router;
