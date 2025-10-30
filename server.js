const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

// Prevent server crashes from unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.log('⚠️  Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.log('⚠️  Uncaught Exception:', error);
});

const app = express();
const PORT = process.env.PORT || 3000;

// Import models
const Product = require("./models/Product");
const Contact = require("./models/Contact");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(__dirname)); // Serves files from root
app.use(express.static(path.join(__dirname, 'public'))); // Serves files from public folder
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'views'));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "building-materials-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  })
);

// MongoDB connection (optional - website works without it)
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/building_materials";
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.log("⚠️  MongoDB not connected (website will work without database features)");
    console.log("   To enable database features, install MongoDB or use MongoDB Atlas");
  });

// API routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Frontend routes
app.get('/', (req, res) => {
  // Render the modern index page
  res.render('index-new');
});

app.get('/old', (req, res) => res.render('index'));
// Frontend pages for auth, cart, checkout, orders
app.get('/login', (req, res) => res.render('login'));
app.get('/signup', (req, res) => res.render('signup'));
app.get('/product', (req, res) => res.render('product-detail'));
app.get('/cart', (req, res) => res.render('cart'));
app.get('/checkout', (req, res) => res.render('checkout'));
app.get('/order-confirmation', (req, res) => res.render('order-confirmation'));
app.get('/orders', (req, res) => res.render('orders'));
app.get('/admin-dashboard', (req, res) => res.render('admin-dashboard'));
app.get('/session-test', (req, res) => res.render('session-test'));

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/products", async (req, res) => {
  try {
    const products = mongoose.connection.readyState === 1 ? await Product.find() : [];
    res.render("products", { products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.render("products", { products: [] });
  }
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

// Cart debugging tool
app.get("/cart-debug", (req, res) => {
  res.render("cart-debug");
});

// Contact form submission
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.redirect("/contact?success=true");
  } catch (error) {
    console.error("Error saving contact:", error);
    res.redirect("/contact?error=true");
  }
});

// Admin routes
app.get("/admin", (req, res) => {
  res.render("admin");
});

app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;
  // Simple authentication (replace with proper authentication in production)
  if (username === "admin" && password === "admin123") {
    req.session.isAdmin = true;
    res.redirect("/admin/dashboard");
  } else {
    res.redirect("/admin?error=true");
  }
});

app.get("/admin/dashboard", async (req, res) => {
  if (!req.session.isAdmin) {
    return res.redirect("/admin");
  }
  try {
    const products = await Product.find();
    const contacts = await Contact.find().sort({ date: -1 });
    res.render("admin_dashboard", { products, contacts });
  } catch (error) {
    console.error("Error loading dashboard:", error);
    res.status(500).send("Error loading dashboard");
  }
});

app.post("/admin/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// Admin product management
app.post("/admin/product/add", async (req, res) => {
  if (!req.session.isAdmin) {
    return res.redirect("/admin");
  }
  try {
    const { name, image, description, price } = req.body;
    const newProduct = new Product({ name, image, description, price });
    await newProduct.save();
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error adding product:", error);
    res.redirect("/admin/dashboard?error=true");
  }
});

app.post("/admin/product/delete/:id", async (req, res) => {
  if (!req.session.isAdmin) {
    return res.redirect("/admin");
  }
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.redirect("/admin/dashboard?error=true");
  }
});

app.post("/admin/product/:id/variant/add", async (req, res) => {
  if (!req.session.isAdmin) {
    return res.redirect("/admin");
  }
  try {
    const { name, image, description, price } = req.body;
    const product = await Product.findById(req.params.id);
    product.variants.push({ name, image, description, price });
    await product.save();
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error adding variant:", error);
    res.redirect("/admin/dashboard?error=true");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
