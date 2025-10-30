# Seed Production Database (MongoDB Atlas)

## Problem
Your Render backend is connected to MongoDB Atlas (cloud database), but it has **0 products**. The local seed we ran only populated your LOCAL database, not the production one.

## Solution: Seed the Production Database

### Option 1: Run seed script with Production MongoDB URI (RECOMMENDED)

1. **Get your MongoDB Atlas connection string** from Render dashboard:
   - Go to: https://dashboard.render.com/
   - Click on your "brickngo-backend" service
   - Go to "Environment" tab
   - Find the `MONGODB_URI` value (it starts with `mongodb+srv://`)
   - Copy this value

2. **Run the seed script with production database**:
   ```powershell
   # Set the production MongoDB URI temporarily
   $env:MONGODB_URI = "YOUR_MONGODB_ATLAS_CONNECTION_STRING_HERE"
   
   # Run the seed script
   node seed.js
   ```

   Replace `YOUR_MONGODB_ATLAS_CONNECTION_STRING_HERE` with the actual MongoDB Atlas URI from Render.

3. **Verify products were added**:
   ```powershell
   curl https://brickngo-backend.onrender.com/api/products
   ```
   
   You should see 12 products!

### Option 2: Add Products via Admin Panel

1. Go to: https://brickngo-backend.onrender.com/admin
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. Manually add each of the 12 products

### Option 3: Use MongoDB Atlas Web Interface

1. Go to: https://cloud.mongodb.com/
2. Login to your MongoDB Atlas account
3. Go to your cluster → Collections
4. Import the products data from `seed.js`

## After Seeding

Once the database is seeded, refresh your Netlify site:
- https://brickngo-shop.netlify.app

You should now see:
✅ All 12 product images
✅ Product details
✅ Login/Signup working
✅ Add to cart working

## Test Login

After seeding, you can login with:
- **Admin**: admin@brickngo.com / admin123
- **Customer**: test@customer.com / test123
