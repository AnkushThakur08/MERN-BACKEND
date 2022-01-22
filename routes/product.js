const express = require("express");
const router = express.Router();

const {
  getProductById,
  createProduct,
  getProduct,
  photo,
  updateProduct,
  deleteProduct,
  getAllProduct,
  getAllUniqueCategory,
} = require("../controllers/product");

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

// Parameter Extactor
router.param("userId", getUserById);
router.param("productId", getProductById);

// Actual routes

// CREATE Route
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);

// READ Route
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

// DELETE Route
router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteProduct
);

// UPDATE Route
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);

// Listing Route
router.get("/products", getAllProduct);

router.get("/products/categories", getAllUniqueCategory);

module.exports = router;
