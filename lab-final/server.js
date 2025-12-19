const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const connectDB = require("./config/database");
const ProductModel = require("./models/product.model");
const OrderModel = require("./models/order.model");

const PORT = 3000;

// MongoDB connection
connectDB();

// Seeding Function (called manually or on first run)
const seedProducts = async () => {
  const count = await ProductModel.countDocuments();
  if (count === 0) {
    const products = [
      { name: "Slogans & Phrases", price: 150, category: "Creative", image: "/images/home_copywriter_pic1.png", description: "Catchy slogans aimed to capture attention." },
      { name: "SEO Article", price: 200, category: "Marketing", image: "/images/home_copywriter_pic1.png", description: "Optimized articles to rank high on search engines." },
      { name: "Short Story", price: 100, category: "Creative", image: "/images/home_copywriter_pic1.png", description: "Engaging short stories for your audience." },
      { name: "Technical Blog", price: 250, category: "Technical", image: "/images/home_copywriter_pic1.png", description: "In-depth technical content for experts." },
      { name: "Social Media Post", price: 50, category: "Marketing", image: "/images/home_copywriter_pic1.png", description: "Viral content for social platforms." },
      { name: "Product Description", price: 80, category: "E-commerce", image: "/images/home_copywriter_pic1.png", description: "Compelling descriptions to boost sales." },
      { name: "Email Newsletter", price: 120, category: "Marketing", image: "/images/home_copywriter_pic1.png", description: "Newsletters that drive conversions." },
      { name: "White Paper", price: 500, category: "Technical", image: "/images/home_copywriter_pic1.png", description: "Authoritative reports on complex issues." }
    ];
    await ProductModel.insertMany(products);
    console.log("Database seeded with sample products.");
  }
};

// Call seeding on server start
seedProducts();

//expose public folder to the browser
app.use(express.static("public"));

// Middleware
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // For PUT/DELETE in forms

// Session configuration for admin authentication
app.use(session({
  secret: "admin-secret-key-12345",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

app.use(expressLayouts);

// Configure express-ejs-layouts
app.set('layout', 'layout'); // Default layout for main site
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

// Admin Routes
const adminRoutes = require("./admin/routes");
app.use("/admin", adminRoutes);

// Main Page Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/index.html", (req, res) => {
  res.redirect("/");
});

// Seeding Function


app.get("/products", async (req, res) => {
  let { page = 1, limit = 6, category, search } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  let filter = {};
  if (category) filter.category = category;
  if (search) filter.name = { $regex: search, $options: "i" };

  try {
    const total = await ProductModel.countDocuments(filter);
    const products = await ProductModel.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    const categories = await ProductModel.distinct("category");

    res.render("products", {
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      categories,
      selectedCategory: category,
      search: search || ""
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching products");
  }
});

app.get("/product/:id", async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) return res.status(404).send("Product not found");
    res.render("product-details", { product });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching product");
  }
});

app.get("/products.html", (req, res) => {
  res.redirect("/products");
});

app.get("/checkout", (req, res) => {
  res.render("checkout");
});
app.get("/Checkout.html", (req, res) => {
  res.redirect("/checkout");
});

// Import order middleware for validation and cart checking
const { checkCartNotEmpty, validateCheckoutInputs } = require("./middlewares/order");

/**
 * ROUTE: POST /api/orders
 * 
 * This route handles order creation from the checkout page.
 * It converts the cart items into a persistent order stored in MongoDB.
 * 
 * Middleware Chain:
 * 1. checkCartNotEmpty - Validates cart has items (Task 2)
 * 2. validateCheckoutInputs - Server-side validation & cart total recalculation (Task 4)
 * 
 * Request Body:
 * - customerName: string - Customer's full name
 * - email: string - Customer's email address
 * - items: array - Cart items with {name, price, quantity}
 * - totalAmount: number - Total order amount
 * 
 * Response:
 * - Success: { success: true, orderId: string, message: string }
 * - Error: { error: string } with appropriate status code
 */
app.post("/api/orders", checkCartNotEmpty, validateCheckoutInputs, async (req, res) => {
  try {
    const { customerName, email, items, totalAmount } = req.body;

    // Create new order with validated data
    const order = new OrderModel({
      customerName,
      email,
      items,
      totalAmount,
      status: "Pending"
    });

    await order.save();

    res.status(201).json({
      success: true,
      orderId: order._id,
      message: "Order created successfully"
    });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Error creating order" });
  }
});

// Order confirmation page
app.get("/order-confirmation/:orderId", async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.orderId);
    if (!order) {
      return res.status(404).render("error", { message: "Order not found" });
    }
    res.render("order-confirmation", { order });
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).send("Error fetching order");
  }
});

app.get("/contact", (req, res) => {
  res.render("contact");
});
app.get("/contact.html", (req, res) => {
  res.redirect("/contact");
});

app.get("/about", (req, res) => {
  res.render("about"); // Assuming about.ejs is created or reusing another view, currently mapped to about.ejs
});
app.get("/about.html", (req, res) => {
  res.redirect("/about");
});


app.get("/cv", (req, res) => {
  res.render("cv");
});
app.get("/CV.html", (req, res) => {
  res.redirect("/cv");
});

app.get("/crud", (req, res) => {
  res.render("crud");
});
app.get("/Crud.html", (req, res) => {
  res.redirect("/crud");
});

app.get("/registration", (req, res) => {
  res.render("registration");
});
app.get("/registeration.html", (req, res) => {
  res.redirect("/registration");
});


// API Routes (kept from previous project)
app.get("/api/products/:id", async (req, res) => {
  const product = await ProductModel.findById(req.params.id);
  res.send(product);
});
app.delete("/api/products/:id", async (req, res) => {
  const product = await ProductModel.findByIdAndDelete(req.params.id);
  res.send(product);
});

app.get("/api/products", async (req, res) => {
  const products = await ProductModel.find();
  res.send(products);
});
app.post("/api/products", async (req, res) => {
  let data = req.body;
  let record = new ProductModel(data);
  await record.save();
  res.send(record);
});
app.put("/api/products/:id", async (req, res) => {
  let data = req.body;
  // let record = await ProductModel.findByIdAndUpdate(req.params.id, data, {
  //   new: true,
  // });
  let record = await ProductModel.findById(req.params.id);
  record.name = data.name;
  record.price = data.price;
  record.description = data.description;
  await record.save();
  res.send(record);
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});