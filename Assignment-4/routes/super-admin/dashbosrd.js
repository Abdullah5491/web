const express = require("express");
const Product = require("../../models/Product");
let router = express.Router();

router.get("/", async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const productsByCategory = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    return res.render("super-admin/dashboard", {
      totalProducts,
      productsByCategory
    });
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    return res.render("super-admin/dashboard", {
      totalProducts: 0,
      productsByCategory: []
    });
  }
});

module.exports = router;
