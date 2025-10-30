# 🏗️ BrickNGo - Complete E-Commerce Platform Setup Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation Steps](#installation-steps)
3. [Database Setup](#database-setup)
4. [Payment Gateway Setup](#payment-gateway-setup)
5. [Running the Application](#running-the-application)
6. [Testing Guide](#testing-guide)
7. [Admin Panel Access](#admin-panel-access)
8. [API Documentation](#api-documentation)
9. [Deployment](#deployment)

---

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** (optional) - [Download](https://git-scm.com/)

### Check Installation:
```bash
node --version    # Should show v14.x.x or higher
npm --version     # Should show 6.x.x or higher
mongod --version  # Should show db version v4.4.x or higher
```

---

## 📥 Installation Steps

### Step 1: Install Dependencies
```bash
cd building_materials
npm install
```

This installs all required packages:
- express, mongoose, ejs (core framework)
- bcryptjs, jsonwebtoken (authentication)
- razorpay (payment gateway)
- express-validator, cors, cookie-parser (utilities)
- dotenv (environment variables)

### Step 2: Configure Environment Variables

The `.env` file has been created with default values. **Important**: Update these values for production:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/building_materials

# JWT Secret (CHANGE THIS!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
JWT_EXPIRES_IN=30d

# Razorpay (Get from https://dashboard.razorpay.com/)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Admin Credentials
ADMIN_EMAIL=admin@brickngo.com
ADMIN_PASSWORD=admin123
```

---

## 🗄️ Database Setup

### Step 1: Start MongoDB

**Windows:**
```bash
# Open Command Prompt as Administrator
net start MongoDB
```

**Mac/Linux:**
```bash
sudo systemctl start mongod
# OR
mongod
```

### Step 2: Verify MongoDB is Running
```bash
mongo --eval "db.adminCommand('ping')"
# Should return { "ok" : 1 }
```

### Step 3: Database Auto-Initialization

The application automatically creates:
- ✅ **12 Sample Products** (bricks, cement, sand, etc.)
- ✅ **Admin User** (email: admin@brickngo.com, password: admin123)
- ✅ **Database Collections** (users, products, orders, carts)

This happens automatically when you start the server for the first time!

---

## 💳 Payment Gateway Setup (Razorpay)

### Step 1: Create Razorpay Account
1. Go to [https://dashboard.razorpay.com/signup](https://dashboard.razorpay.com/signup)
2. Sign up with your email
3. Verify your email and phone number

### Step 2: Get Test API Keys
1. Login to Razorpay Dashboard
2. Go to **Settings** → **API Keys**
3. Click **Generate Test Keys**
4. Copy **Key ID** and **Key Secret**

### Step 3: Update .env File
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_actual_secret_key
```

### Step 4: Test Mode
- Razorpay test mode allows you to simulate payments
- **Test Card**: 4111 1111 1111 1111
- **CVV**: Any 3 digits
- **Expiry**: Any future date

---

## 🚀 Running the Application

### Method 1: Using the New Server (Recommended)
```bash
node server-new.js
```

### Method 2: Using npm start
```bash
# Update package.json first
npm start
```

### You Should See:
```
✅ Connected to MongoDB
📦 Initializing database with sample products...
✅ Sample products added successfully
👤 Creating admin user...
✅ Admin user created
   Email: admin@brickngo.com
   Password: admin123

🚀 Server running on http://localhost:3000
📱 Environment: development

📝 API Documentation:
   Auth:     http://localhost:3000/api/auth
   Products: http://localhost:3000/api/products
   Cart:     http://localhost:3000/api/cart
   Orders:   http://localhost:3000/api/orders
```

### Open in Browser:
```
http://localhost:3000
```

---

## 🧪 Testing Guide

### Complete E-Commerce Flow Test

#### 1. **Customer Registration**
1. Open `http://localhost:3000`
2. Click **Sign Up** button
3. Fill in details:
   - Name: John Doe
   - Email: john@example.com
   - Password: password123
   - Phone: 9876543210
4. Click **Create Account**
5. You should be logged in automatically

#### 2. **Browse Products**
1. Scroll to **Products** section
2. Use **category filters**: All / Bricks / Cement / Sand
3. Try **search bar**: Search for "cement" or "brick"
4. Use **sorting**: Price Low to High, Price High to Low
5. Click on any product to see details

#### 3. **Add to Cart**
1. Click **"Add to Cart"** on any product
2. Green notification should appear
3. Cart badge (top-right) should update with count
4. Add multiple products with different quantities

#### 4. **View & Manage Cart**
1. Click **shopping cart icon** (bottom-right dock)
2. Cart sidebar opens from right
3. Test quantity controls:
   - Click **+** to increase quantity
   - Click **-** to decrease quantity
   - Click **trash icon** to remove item
4. Verify total price updates automatically

#### 5. **Checkout Process**
1. In cart, click **"Proceed to Checkout"**
2. Fill shipping address:
   - Full Name
   - Phone Number (10 digits)
   - Email
   - Address Line 1
   - Address Line 2 (optional)
   - City
   - State
   - Pincode (6 digits)
3. Review order summary (Subtotal, Tax 18%, Shipping, Total)
4. Select payment method:
   - **Cash on Delivery** (COD)
   - **Card Payment** (Razorpay)
   - **UPI**
   - **Net Banking**

#### 6A. **Test COD Payment**
1. Select **Cash on Delivery**
2. Click **"Place Order"**
3. Order confirmation page appears
4. Note the **Order Number** (e.g., ORD1730234567890)
5. Status: **Confirmed**
6. Estimated Delivery: 7 days from now

#### 6B. **Test Online Payment (Razorpay)**
1. Select **Card Payment**
2. Click **"Proceed to Payment"**
3. Razorpay payment modal opens
4. Test Card Details:
   ```
   Card Number: 4111 1111 1111 1111
   CVV: 123
   Expiry: 12/25
   Name: Test User
   ```
5. Click **Pay Now**
6. Payment success → Order confirmed
7. Order confirmation page with order details

#### 7. **View Order History**
1. Click **"My Orders"** (in user menu)
2. See all your orders
3. Click on any order to view details:
   - Products ordered
   - Quantities & prices
   - Shipping address
   - Payment status
   - Order status
   - Tracking information

#### 8. **Cancel Order** (if not shipped)
1. Go to **My Orders**
2. Click on a pending/confirmed order
3. Click **"Cancel Order"**
4. Order status changes to **Cancelled**
5. Stock is restored automatically

---

### 👨‍💼 Admin Panel Testing

#### 1. **Admin Login**
```
URL: http://localhost:3000/admin/login
Email: admin@brickngo.com
Password: admin123
```

#### 2. **Admin Dashboard**
After login, you'll see:
- **Total Orders** (today, this week, this month)
- **Total Revenue**
- **Total Products**
- **Total Customers**
- **Recent Orders Table**
- **Low Stock Alerts**

#### 3. **Product Management**

**Add New Product:**
1. Click **"Add Product"**
2. Fill in details:
   - Name: "Premium Concrete Mix"
   - Category: Cement
   - Description: "Ready-to-use concrete mix..."
   - Price: 450
   - Unit: per bag
   - Stock: 1000
   - Image URL: (paste image link)
3. Click **"Create Product"**
4. Product appears in products list

**Edit Product:**
1. Find product in list
2. Click **"Edit"**
3. Update any field (price, stock, description)
4. Click **"Update"**
5. Changes saved instantly

**Update Stock:**
1. Click **"Update Stock"** on any product
2. Enter new stock quantity
3. Click **"Save"**
4. Stock updated in database

**Delete Product:**
1. Click **"Delete"** on any product
2. Confirm deletion
3. Product removed (soft delete - marked as inactive)

#### 4. **Order Management**

**View All Orders:**
1. Click **"Orders"** tab
2. See all customer orders
3. Filter by status:
   - All Orders
   - Pending
   - Confirmed
   - Processing
   - Shipped
   - Delivered
   - Cancelled

**Update Order Status:**
1. Click on any order
2. Current status shown
3. Click **"Update Status"** dropdown
4. Select new status:
   - Confirmed → Processing → Shipped → Delivered
5. Add note (optional)
6. Click **"Update"**
7. Customer can see updated status

**View Order Details:**
- Customer name, email, phone
- Shipping address
- Products ordered (with images)
- Payment method & status
- Total amount
- Order timeline (status history)

#### 5. **Customer Management**
1. Click **"Customers"** tab
2. View all registered customers
3. See customer details:
   - Name, Email, Phone
   - Total orders
   - Total spent
   - Registration date
4. View customer's order history

---

## 📡 API Documentation

### Authentication APIs

#### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Product APIs

#### Get All Products (with filters)
```http
GET /api/products?category=Bricks&search=red&minPrice=5&maxPrice=10&sort=price-low&page=1&limit=12
```

#### Get Single Product
```http
GET /api/products/:id
```

### Cart APIs (Requires Authentication)

#### Get Cart
```http
GET /api/cart
Authorization: Bearer <token>
```

#### Add to Cart
```http
POST /api/cart/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product_id_here",
  "quantity": 2
}
```

#### Update Cart Item
```http
PUT /api/cart/update
Authorization: Bearer <token>

{
  "productId": "product_id_here",
  "quantity": 5
}
```

#### Remove from Cart
```http
DELETE /api/cart/remove/:productId
Authorization: Bearer <token>
```

### Order APIs (Requires Authentication)

#### Create Order
```http
POST /api/orders/create
Authorization: Bearer <token>

{
  "shippingAddress": {
    "name": "John Doe",
    "phone": "9876543210",
    "addressLine1": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "paymentMethod": "cod"
}
```

#### Get My Orders
```http
GET /api/orders/my-orders
Authorization: Bearer <token>
```

#### Get Single Order
```http
GET /api/orders/:orderId
Authorization: Bearer <token>
```

---

## 🌐 Deployment

### Deploying to Production

#### 1. **Environment Setup**
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=super-long-random-string-change-this
RAZORPAY_KEY_ID=rzp_live_your_live_key
RAZORPAY_KEY_SECRET=your_live_secret
```

#### 2. **MongoDB Atlas (Cloud Database)**
1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create new cluster
4. Get connection string
5. Update `MONGODB_URI` in .env

#### 3. **Deploy to Heroku**
```bash
# Install Heroku CLI
heroku login
heroku create brickngo-store

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set RAZORPAY_KEY_ID=your_razorpay_key

# Deploy
git push heroku main

# Open app
heroku open
```

#### 4. **Deploy to Vercel/Netlify**
- Both support Node.js backends
- Configure environment variables in dashboard
- Connect GitHub repository
- Auto-deploy on push

---

## 🔒 Security Checklist

Before going live:

- [ ] Change all default passwords
- [ ] Update JWT_SECRET to random string (32+ characters)
- [ ] Use MongoDB Atlas (not local MongoDB)
- [ ] Enable HTTPS
- [ ] Switch Razorpay to live mode
- [ ] Add rate limiting
- [ ] Enable CORS only for your domain
- [ ] Set secure cookies (httpOnly, secure, sameSite)
- [ ] Add input sanitization
- [ ] Enable MongoDB authentication
- [ ] Regular backups
- [ ] Monitor error logs

---

## 📞 Support & Troubleshooting

### Common Issues:

**MongoDB Connection Failed:**
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB service
# Windows: net start MongoDB
# Mac/Linux: sudo systemctl start mongod
```

**Port 3000 Already in Use:**
```bash
# Change port in .env
PORT=4000
```

**Razorpay Payment Not Working:**
- Check API keys are correct
- Ensure test mode is enabled
- Check browser console for errors

**Products Not Showing:**
- Ensure MongoDB is connected
- Check database initialization logs
- Manually add products via admin panel

---

## 🎉 Features Implemented

### Customer Features:
✅ User Registration & Login (JWT Authentication)
✅ Browse Products with Search & Filters
✅ Product Details Page
✅ Add to Cart (Real-time updates)
✅ Cart Management (Update quantity, Remove items)
✅ Checkout with Address Validation
✅ Multiple Payment Options (COD, Card, UPI, NetBanking)
✅ Razorpay Payment Integration
✅ Order Confirmation
✅ Order History
✅ Order Tracking
✅ Cancel Order
✅ User Profile Management
✅ Responsive Design (Mobile-friendly)

### Admin Features:
✅ Admin Login (Separate from customers)
✅ Dashboard with Analytics
✅ Product Management (CRUD)
✅ Stock Management
✅ Order Management
✅ Update Order Status
✅ Customer Management
✅ View All Orders
✅ Sales Reports

### Technical Features:
✅ MongoDB Database
✅ RESTful APIs
✅ JWT Authentication
✅ Password Hashing (bcrypt)
✅ Session Management
✅ Real Payment Gateway (Razorpay)
✅ Input Validation
✅ Error Handling
✅ Stock Management
✅ Order Tracking
✅ Status History
✅ Email/Phone Validation

---

## 📚 Next Steps

1. **Start the server**: `node server-new.js`
2. **Open browser**: http://localhost:3000
3. **Create account** and test the complete flow
4. **Login as admin** and manage products/orders
5. **Customize** the design and products as needed

---

**🎊 Congratulations! You now have a fully functional e-commerce platform ready to launch!**

For questions or issues, check the logs or contact support.
