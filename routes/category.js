const express = require("express");
const router = express.Router();

const {
  getCategoryById,
  createCategory,
  getCategory,
  getAllCategory,
  updateCategory,
  removeCategory,
} = require("../controllers/category");

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

// Paramaters
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

// Actual Routes
// TODO: Creating a Category by ADMIN, (CREATE)
router.post(
  "/category/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createCategory
);

// TODO: Getting a Category from CategoryID (READ)
router.get("/category/:categoryId", getCategory);

// TODO: Getting all Categories (READ)
router.get("/categories", getAllCategory);

// TODO: Updating Category by ADMIN (UPDATE)
router.put(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateCategory
);

// TODO: Deleting a Category by ADMIN (DELETE)
router.delete(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  removeCategory
);

module.exports = router;
