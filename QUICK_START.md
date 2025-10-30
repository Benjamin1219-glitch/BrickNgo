# 🚀 Quick Start Guide - BrickNGo E-Commerce Platform

## ⚠️ Important: MongoDB Required

Your e-commerce platform is almost ready! However, **MongoDB is not currently running** on your system.

---

## 📋 Quick Setup Steps

### Option 1: Install MongoDB Locally (Recommended for learning)

#### For Windows:

1. **Download MongoDB:**
   - Go to https://www.mongodb.com/try/download/community
   - Download MongoDB Community Server for Windows
   - Run the installer (.msi file)

2. **Install MongoDB:**
   - Choose "Complete" installation
   - Install as a Windows Service (check the box)
   - MongoDB Compass will also be installed (GUI tool)

3. **Verify Installation:**
   Open PowerShell and run:
   ```powershell
   mongod --version
   ```

4. **Start MongoDB Service:**
   MongoDB should start automatically. If not:
   ```powershell
   net start MongoDB
   ```

5. **Run the Seed Script:**
   ```powershell
   cd "c:\Users\saisr\OneDrive\Desktop\teja\kira\Building_materials\building_materials"
   node seed.js
   ```

---

### Option 2: Use MongoDB Atlas (Cloud - No Installation)

**Easiest option - completely free!**

1. **Create Account:**
   - Go to https://www.mongodb.com/cloud/atlas
   - Click "Try Free"
   - Sign up with email or Google

2. **Create Cluster:**
   - Choose "Free" tier (M0 Sandbox)
   - Select a cloud provider and region closest to you
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Setup Database Access:**
   - Click "Database Access" in left menu
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `brickngo`
   - Password: `brickngo123` (or create your own)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Setup Network Access:**
   - Click "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Get Connection String:**
   - Click "Database" in left menu
   - Click "Connect" button on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like):
     ```
     mongodb+srv://brickngo:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password

6. **Update .env File:**
   Create or update `.env` in your project folder:
   ```env
   PORT=3000
   MONGODB_URI=mongodb+srv://brickngo:brickngo123@cluster0.xxxxx.mongodb.net/building_materials?retryWrites=true&w=majority
   JWT_SECRET=your-secret-key-change-in-production
   SESSION_SECRET=your-session-secret-key
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```

7. **Run Seed Script:**
   ```powershell
   node seed.js
   ```

---

## ✅ After MongoDB is Running

### 1. Seed the Database

```powershell
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

### 2. Start the Server

```powershell
node server.js
```

Expected output:
```
Server is running on http://localhost:3000
✅ Connected to MongoDB
```

### 3. Access Your E-Commerce Platform

Open browser and go to:
- **🏠 Home:** http://localhost:3000
- **🛍️ Shop:** http://localhost:3000/shop
- **🛒 Cart:** http://localhost:3000/cart
- **📦 Orders:** http://localhost:3000/orders
- **⚙️ Admin Dashboard:** http://localhost:3000/admin-dashboard

### 4. Login Credentials

**Admin Account:**
- Email: `admin@brickngo.com`
- Password: `admin123`
- Access: Full admin dashboard, manage products & orders

**Test Customer:**
- Email: `test@customer.com`
- Password: `test123`
- Access: Shopping, cart, orders

---

## 🧪 Test the Complete Flow

### Step 1: Customer Journey
1. Go to http://localhost:3000/shop
2. Browse products (12 building materials)
3. Use search: type "cement"
4. Filter by category: select "Bricks"
5. Click "Add to Cart" on any product
6. Go to http://localhost:3000/cart
7. Update quantities
8. Click "Proceed to Checkout"
9. Fill shipping address
10. Select "Cash on Delivery"
11. Click "Place Order"
12. Check http://localhost:3000/orders for your order

### Step 2: Admin Journey
1. Logout (if logged in as customer)
2. Go to http://localhost:3000/login
3. Login with admin credentials
4. Go to http://localhost:3000/admin-dashboard
5. View statistics (products, orders, revenue)
6. Click "Add Product" to create new product
7. Edit existing products (update stock, price)
8. Scroll to "Recent Orders"
9. Update order status (e.g., "Shipped")

---

## 📁 Project Structure

```
building_materials/
├── models/              # Database schemas
│   ├── User.js          # User authentication
│   ├── Product.js       # Product catalog
│   ├── Order.js         # Order management
│   ├── Cart.js          # Shopping cart
│   └── Contact.js       # Contact form
├── controllers/         # Business logic
│   ├── authController.js
│   ├── productController.js
│   ├── cartController.js
│   └── orderController.js
├── routes/              # API routes
├── middleware/          # Authentication middleware
├── views/               # EJS templates
│   ├── login.ejs
│   ├── signup.ejs
│   ├── shop.ejs
│   ├── cart.ejs
│   ├── checkout.ejs
│   ├── orders.ejs
│   └── admin-dashboard.ejs
├── public/              # Static files
│   └── js/              # Client-side JavaScript
├── server.js            # Main server file
├── seed.js              # Database seeding script
├── .env                 # Environment variables (create this!)
└── package.json         # Dependencies
```

---

## 🔧 Features Implemented

### ✅ Customer Features
- User registration & login (JWT authentication)
- Browse products with images, prices, stock
- Search products by name/description
- Filter by category (Bricks, Cement, Sand, etc.)
- Filter by price range
- Sort by price, rating, newest
- Add to cart with quantity selection
- Update cart (change quantities, remove items)
- Checkout with shipping address
- Multiple payment methods (COD, Card, UPI)
- View order history
- Cancel orders
- Real-time stock validation

### ✅ Admin Features
- Admin login (separate from customer)
- Dashboard with statistics
  - Total products
  - Total orders
  - Total revenue
  - Pending orders count
- Product management
  - Add new products
  - Edit products (name, price, stock, category)
  - Delete products
  - View all products in table
- Order management
  - View all orders
  - Update order status (pending → confirmed → processing → shipped → delivered)
  - Add notes to orders
  - View customer details

### ✅ Technical Features
- **Backend:** Node.js + Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT tokens + bcrypt password hashing
- **Session Management:** Express sessions with cookies
- **Payment Gateway:** Razorpay integration (test mode)
- **Security:** Protected routes, input validation, XSS prevention
- **Architecture:** MVC pattern (Models, Views, Controllers)
- **API:** RESTful API with proper HTTP methods
- **Frontend:** EJS templating + vanilla JavaScript
- **Styling:** Custom CSS (responsive design)

---

## 🚨 Troubleshooting

### Issue: "MongoDB not connected"
**Solution:** Follow Option 1 or Option 2 above to setup MongoDB

### Issue: "Port 3000 already in use"
**Solution:** 
```powershell
# Find process using port 3000
netstat -ano | findstr :3000
# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
# Or change port in .env
PORT=3001
```

### Issue: Seed script fails
**Solution:** 
1. Make sure MongoDB is running
2. Check `.env` has correct `MONGODB_URI`
3. Try deleting `node_modules` and run `npm install` again

### Issue: Can't login
**Solution:**
1. Run seed script first: `node seed.js`
2. Use correct credentials (see above)
3. Clear browser cookies/cache
4. Check browser console for errors

---

## 📞 Need Help?

**Common Commands:**
```powershell
# Install dependencies
npm install

# Seed database
node seed.js

# Start server
node server.js

# Check MongoDB status (if installed locally)
net start MongoDB

# View all npm packages
npm list

# Clear npm cache (if issues)
npm cache clean --force
```

**Check these files if something's wrong:**
1. `.env` - Environment variables configured?
2. `server.js` - Server running without errors?
3. Browser Console (F12) - Any JavaScript errors?
4. MongoDB - Is it running?

---

## 🎉 You're All Set!

Once MongoDB is running and you've seeded the database, your complete e-commerce platform is ready to use!

**What's included:**
- 12 sample building material products
- Admin account with full access
- Test customer account
- Complete shopping flow (browse → cart → checkout → order)
- Admin dashboard for management
- Payment integration (Razorpay test mode)
- Search and filters
- Order tracking
- Stock management

**Happy coding! 🚀**
