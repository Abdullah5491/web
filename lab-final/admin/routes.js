const express = require("express");
const router = express.Router();
const productController = require("./controllers/productController");
const orderController = require("./controllers/orderController");
const authController = require("./controllers/authController");
const { isAuthenticated } = require("../middlewares/auth");
const { validateProduct } = require("../middlewares/validation");
const upload = require("../config/upload");

// Disable main site layout for admin routes - use admin layout only
router.use((req, res, next) => {
  req.app.set('layout', false); // Disable express-ejs-layouts
  next();
});

// Public routes (no authentication required)
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/register", authController.getRegister);
router.post("/register", authController.postRegister);
router.get("/logout", authController.logout);

// Apply authentication middleware to all routes below
router.use(isAuthenticated);

// Dashboard
router.get("/", productController.getDashboard);

// Product management routes
router.get("/products", productController.getProducts);
router.get("/products/add", productController.getAddProduct);
router.post("/products", upload.single('image'), validateProduct, productController.createProduct);
router.get("/products/:id/edit", productController.getEditProduct);
router.post("/products/:id", upload.single('image'), validateProduct, productController.updateProduct);
router.post("/products/:id/delete", productController.deleteProduct);

// Order management routes (Task 3: Admin Orders Dashboard)
router.get("/orders", orderController.getOrders);
router.post("/orders/:id/confirm", orderController.confirmOrder);
router.post("/orders/:id/cancel", orderController.cancelOrder);

module.exports = router;
