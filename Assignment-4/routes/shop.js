var express = require("express");
var router = express.Router();
var Product = require("../models/Product");
const Category = require("../models/Category");

// Cart page
router.get("/cart", async function (req, res, next) {
  let cart = req.cookies.cart;
  if (!cart) cart = [];
  let products = await Product.find({ _id: { $in: cart } });

  let total = products.reduce(
    (total, product) => total + Number(product.price),
    0
  );

  res.render("site/cart", { products, total, layout: false });
});

// Add to cart
router.get("/add-cart/:id", function (req, res, next) {
  let cart = req.cookies.cart;
  if (!cart) cart = [];
  cart.push(req.params.id);
  res.cookie("cart", cart);
  res.redirect("/");
});

// Products listing with pagination, filtering, and search
router.get("/products", async (req, res) => {
  let { page = 1, limit = 6, category, search } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  let filter = {};
  if (category) filter.category = category;
  if (search) filter.name = { $regex: search, $options: "i" };

  try {
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    const categories = await Product.distinct("category");

    res.render("site/products", {
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      categories,
      selectedCategory: category,
      search: search || "",
      layout: false
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching products");
  }
});

// Individual product details
router.get("/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Product not found");
    res.render("site/product-details", { product, layout: false });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching product");
  }
});

// Checkout page
router.get("/checkout", (req, res) => {
  res.render("site/checkout", { layout: false });
});

// About page
router.get("/about", (req, res) => {
  res.render("site/about", { layout: false });
});

// Contact page
router.get("/contact", (req, res) => {
  res.render("site/contact", { layout: false });
});

// Registration page
router.get("/registration", (req, res) => {
  res.render("site/registration", { layout: false });
});

// CV page
router.get("/cv", (req, res) => {
  res.render("site/cv", { layout: false });
});

// CRUD demo page
router.get("/crud", (req, res) => {
  res.render("site/crud", { layout: false });
});

// Homepage with BeCopywriter design from Assignment-3
router.get("/", async function (req, res, next) {
  res.render("site/index", { layout: false });
});

module.exports = router;
