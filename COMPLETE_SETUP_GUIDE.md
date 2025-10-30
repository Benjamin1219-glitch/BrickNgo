# 🧱 BrickNGo - Complete E-Commerce Platform Setup Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Database Setup](#database-setup)
5. [Running the Application](#running-the-application)
6. [Default Credentials](#default-credentials)
7. [API Documentation](#api-documentation)
8. [Testing Guide](#testing-guide)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4 or higher) - [Download](https://www.mongodb.com/try/download/community) OR use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free cloud option)
- **npm** (comes with Node.js)
- **Git** (optional, for version control)

---

## 📦 Installation

### Step 1: Clone or Download the Project

```bash
git clone <your-repository-url>
cd building_materials
```

Or simply download and extract the project folder.

### Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- razorpay
- express-session
- cookie-parser
- body-parser
- dotenv
- ejs

---

## ⚙️ Configuration

### Step 1: Create Environment File

Create a `.env` file in the root directory:

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/building_materials

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-change-this

# Razorpay Configuration (for payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### Step 2: Get Razorpay Credentials (for payment integration)

1. Sign up at [Razorpay](https://razorpay.com/)
2. Go to Settings > API Keys
3. Generate Test Mode keys
4. Copy `Key ID` and `Key Secret` to your `.env` file

**Note:** For testing, use Razorpay Test Mode. No real payments will be processed.

---

## 🗄️ Database Setup

### Option A: Local MongoDB

1. **Install MongoDB** from [mongodb.com](https://www.mongodb.com/try/download/community)
2. **Start MongoDB service:**
   - Windows: MongoDB should start automatically, or run `mongod` in command prompt
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`
3. **Verify connection:** MongoDB should be running on `mongodb://localhost:27017`

### Option B: MongoDB Atlas (Cloud - Recommended for beginners)

1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Set up database user and password
4. Whitelist your IP address (or use 0.0.0.0/0 for testing)
5. Get connection string and update `MONGODB_URI` in `.env`:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/building_materials?retryWrites=true&w=majority
   ```

### Step 3: Seed the Database

Populate the database with sample products and test users:

```bash
node seed.js
```

Expected output:
```
🔌 Connecting to MongoDB...
✅ Connected to MongoDB
🗑️ Clearing existing products...
📦 Creating 12 products...
✅ 12 products created
👤 Creating admin user...
✅ Admin user created: admin@brickngo.com
👤 Creating test customer...
✅ Test customer created: test@customer.com
✅ Database seeded successfully!
```

---

## 🚀 Running the Application

### Development Mode

```bash
node server.js
```

Or using nodemon (auto-restart on file changes):
```bash
npm install -g nodemon
nodemon server.js
```

Expected output:
```
Server is running on http://localhost:3000
✅ Connected to MongoDB
```

### Access the Application

Open your browser and navigate to:
- **Main Website:** http://localhost:3000
- **Shop Page:** http://localhost:3000/shop
- **Login:** http://localhost:3000/login
- **Signup:** http://localhost:3000/signup
- **Cart:** http://localhost:3000/cart
- **Orders:** http://localhost:3000/orders
- **Admin Dashboard:** http://localhost:3000/admin-dashboard

---

## 🔑 Default Credentials

After running `seed.js`, you'll have two test accounts:

### Admin Account
- **Email:** admin@brickngo.com
- **Password:** admin123
- **Access:** Admin Dashboard, Product Management, Order Management

### Test Customer Account
- **Email:** test@customer.com
- **Password:** test123
- **Access:** Shopping, Cart, Orders

---

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/signup`
Create a new user account
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210"
}
```

#### POST `/api/auth/login`
Login to existing account
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET `/api/auth/logout`
Logout current user (clears JWT cookie)

#### GET `/api/auth/me`
Get current logged-in user details (requires authentication)

---

### Product Endpoints

#### GET `/api/products`
Get all products with filtering, search, and pagination

**Query Parameters:**
- `search` - Search by product name/description
- `category` - Filter by category (Bricks, Cement, Sand, etc.)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `sort` - Sort by price, rating, date (-price for descending)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Example:**
```
GET /api/products?category=Bricks&minPrice=5&maxPrice=10&sort=price&page=1&limit=12
```

#### GET `/api/products/:id`
Get single product details

#### POST `/api/products` (Admin only)
Create new product
```json
{
  "name": "Premium Red Bricks",
  "description": "High-quality red bricks...",
  "category": "Bricks",
  "price": 8,
  "unit": "per brick",
  "stock": 50000,
  "image": "https://example.com/image.jpg"
}
```

#### PUT `/api/products/:id` (Admin only)
Update product

#### DELETE `/api/products/:id` (Admin only)
Delete product

---

### Cart Endpoints (All require authentication)

#### GET `/api/cart`
Get current user's cart

#### POST `/api/cart/add`
Add item to cart
```json
{
  "productId": "64abc123...",
  "quantity": 5
}
```

#### PUT `/api/cart/update`
Update cart item quantity
```json
{
  "productId": "64abc123...",
  "quantity": 10
}
```

#### DELETE `/api/cart/remove/:productId`
Remove item from cart

#### DELETE `/api/cart/clear`
Clear entire cart

---

### Order Endpoints

#### POST `/api/orders/create` (Requires authentication)
Create new order from cart
```json
{
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "9876543210",
    "addressLine1": "123 Main Street",
    "addressLine2": "Apartment 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "paymentMethod": "cod"
}
```

**Payment Methods:** `cod`, `card`, `upi`, `netbanking`

**Response for online payment:**
```json
{
  "success": true,
  "order": { ... },
  "razorpayOrder": {
    "id": "order_xyz123",
    "amount": 50000,
    "currency": "INR"
  }
}
```

#### POST `/api/orders/verify-payment` (Requires authentication)
Verify Razorpay payment
```json
{
  "orderId": "64abc123...",
  "razorpayOrderId": "order_xyz123",
  "razorpayPaymentId": "pay_abc456",
  "razorpaySignature": "signature_hash"
}
```

#### GET `/api/orders/my-orders` (Requires authentication)
Get current user's orders

#### GET `/api/orders/:id` (Requires authentication)
Get single order details

#### POST `/api/orders/:id/cancel` (Requires authentication)
Cancel order

#### GET `/api/orders/admin/all` (Admin only)
Get all orders

#### PUT `/api/orders/:id/status` (Admin only)
Update order status
```json
{
  "status": "shipped",
  "note": "Order dispatched via courier"
}
```

---

## 🧪 Testing Guide

### Complete E-Commerce Flow Test

Follow these steps to test the entire system:

#### 1. Customer Registration & Login
1. Go to http://localhost:3000/signup
2. Register a new account with valid details
3. Login at http://localhost:3000/login
4. Verify you're redirected to home page

#### 2. Browse & Search Products
1. Go to http://localhost:3000/shop
2. Try searching for "cement"
3. Filter by category (e.g., "Bricks")
4. Set price range (e.g., ₹5 - ₹100)
5. Sort by "Price: Low to High"
6. Verify products display correctly

#### 3. Add to Cart
1. Click "Add to Cart" on any product
2. Go to http://localhost:3000/cart
3. Verify product appears in cart
4. Try updating quantity (increase/decrease)
5. Verify totals update (subtotal, tax 18%, shipping)
6. Try removing an item
7. Add multiple different products

#### 4. Checkout Process

**Option A: Cash on Delivery (COD)**
1. Click "Proceed to Checkout" from cart
2. Fill in shipping address details
3. Select "Cash on Delivery" as payment method
4. Click "Place Order"
5. Verify success message and order ID
6. Go to http://localhost:3000/orders
7. Verify order appears with status "Pending"

**Option B: Online Payment (Razorpay Test)**
1. Go to checkout
2. Fill shipping address
3. Select "Card" or "UPI" as payment method
4. Click "Place Order"
5. Razorpay test modal should appear
6. Use Razorpay test cards:
   - Card: 4111 1111 1111 1111
   - CVV: Any 3 digits
   - Expiry: Any future date
7. Complete payment
8. Verify order status changes to "Paid"

#### 5. Order Management (Customer)
1. Go to http://localhost:3000/orders
2. Verify all your orders are listed
3. Check order details (items, status, total)
4. Try canceling an order

#### 6. Admin Dashboard
1. Logout from customer account
2. Login with admin credentials:
   - Email: admin@brickngo.com
   - Password: admin123
3. Go to http://localhost:3000/admin-dashboard
4. Verify dashboard statistics load

**Test Product Management:**
1. Click "Add Product" button
2. Fill in product details:
   - Name: Test Product
   - Description: This is a test
   - Category: Others
   - Price: 100
   - Unit: per piece
   - Stock: 50
   - Image URL: https://via.placeholder.com/300
3. Click "Save Product"
4. Verify product appears in table
5. Click "Edit" on a product
6. Update stock to 100
7. Save and verify
8. Click "Delete" on the test product
9. Confirm deletion

**Test Order Management:**
1. Scroll to "Recent Orders" section
2. Click "Update" on any order
3. Change status to "Shipped"
4. Add note: "Order dispatched"
5. Save and verify status changes
6. Logout from admin

#### 7. Verify Stock Updates
1. Login as customer
2. Place an order for 10 bricks (COD)
3. Logout and login as admin
4. Check product stock - should be reduced by 10
5. Cancel the order from admin dashboard
6. Check stock again - should be restored

---

## 🌐 Deployment

### Deploying to Production

#### 1. Prepare for Production

Update `.env` for production:
```bash
NODE_ENV=production
MONGODB_URI=<your-production-mongodb-uri>
JWT_SECRET=<strong-random-secret>
SESSION_SECRET=<strong-random-secret>
RAZORPAY_KEY_ID=<live-razorpay-key>
RAZORPAY_KEY_SECRET=<live-razorpay-secret>
```

#### 2. Security Checklist
- ✅ Change all default secrets
- ✅ Use strong JWT and session secrets
- ✅ Enable HTTPS (SSL certificate)
- ✅ Set secure cookies (`cookie: { secure: true }`)
- ✅ Whitelist MongoDB IP addresses
- ✅ Enable CORS only for your domain
- ✅ Use environment variables (never commit `.env`)
- ✅ Switch Razorpay to Live Mode

#### 3. Deployment Platforms

**Option A: Heroku**
```bash
# Install Heroku CLI
heroku login
heroku create brickngo-app
git push heroku main
heroku config:set MONGODB_URI=<uri>
heroku config:set JWT_SECRET=<secret>
# ... set all environment variables
heroku open
```

**Option B: DigitalOcean/AWS/Azure**
1. Create a Linux server (Ubuntu recommended)
2. Install Node.js and MongoDB
3. Clone repository
4. Install dependencies: `npm install --production`
5. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start server.js --name brickngo
   pm2 startup
   pm2 save
   ```
6. Set up Nginx as reverse proxy
7. Install SSL certificate (Let's Encrypt)

**Option C: Vercel/Netlify (Frontend only)**
For static frontend deployment, you'll need to separate frontend and deploy backend separately.

---

## 🐛 Troubleshooting

### Common Issues

#### ❌ MongoDB Connection Error
**Error:** `MongoDB not connected`

**Solutions:**
1. Ensure MongoDB service is running:
   ```bash
   # Check status
   mongo --eval "db.version()"
   ```
2. Verify `MONGODB_URI` in `.env` is correct
3. For MongoDB Atlas, check:
   - IP whitelist includes your IP
   - Database user credentials are correct
   - Network access is enabled

#### ❌ Port Already in Use
**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solutions:**
1. Change port in `.env`: `PORT=3001`
2. Or kill process using port 3000:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <process_id> /F
   
   # Mac/Linux
   lsof -i :3000
   kill -9 <process_id>
   ```

#### ❌ JWT Authentication Fails
**Error:** `Invalid token` or `Not authorized`

**Solutions:**
1. Clear browser cookies and local storage
2. Verify `JWT_SECRET` is set in `.env`
3. Check JWT token expiry (default 30 days)
4. Ensure cookies are enabled in browser

#### ❌ Razorpay Payment Fails
**Error:** Payment verification failed

**Solutions:**
1. Verify Razorpay credentials in `.env`
2. Ensure using Test Mode keys for testing
3. Check Razorpay dashboard for webhook logs
4. Verify signature verification logic

#### ❌ Products Not Displaying
**Error:** Empty products page

**Solutions:**
1. Run seed script: `node seed.js`
2. Check MongoDB connection is active
3. Verify API endpoint: http://localhost:3000/api/products
4. Check browser console for errors

#### ❌ Session Lost on Page Refresh
**Error:** User logged out on refresh

**Solutions:**
1. Ensure `express-session` middleware is configured
2. For production, use MongoDB session store (`connect-mongo`)
3. Check cookie settings (`httpOnly`, `secure` for HTTPS)

---

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review server logs in terminal
3. Check browser console for frontend errors
4. Verify `.env` configuration
5. Ensure all dependencies are installed: `npm install`

---

## 🎉 Success!

If you've completed all steps:
- ✅ Server is running
- ✅ Database is connected and seeded
- ✅ You can login and browse products
- ✅ Cart and checkout work
- ✅ Orders are created successfully
- ✅ Admin dashboard is accessible

**Congratulations! Your e-commerce platform is ready!** 🚀

---

## 📝 License

This project is for educational purposes. Modify as needed for production use.
