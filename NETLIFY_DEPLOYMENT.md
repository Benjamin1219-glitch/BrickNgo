# BrickNgo - Netlify Deployment Guide

## Important Notice
This is a **full-stack Node.js/Express application** with MongoDB. Netlify is optimized for static sites and serverless functions.

## Deployment Options

### Option 1: Local Development Only (Recommended for Now)
Since you want to "publish locally", run the application on your local machine:

```powershell
# Navigate to project directory
cd "c:\Users\saisr\OneDrive\Desktop\teja\kira\Building_materials\building_materials"

# Install dependencies (if not already done)
npm install

# Start the server
npm start
```

Your site will be available at: **http://localhost:3000**

### Option 2: Netlify with Serverless Functions (Advanced)
To deploy to Netlify, you need to convert the Express app to serverless functions. This requires:

1. **MongoDB Atlas** (free tier available)
   - Sign up at https://www.mongodb.com/cloud/atlas
   - Create a cluster
   - Get your connection string

2. **Convert to Serverless**
   - Each Express route becomes a Netlify Function
   - Static files go in the `public` folder
   - API calls route to `/.netlify/functions/`

### Option 3: Deploy to Render/Railway/Heroku (Easier)
These platforms support Node.js apps natively:

**Render (Recommended):**
```powershell
# 1. Create account at https://render.com
# 2. Connect your GitHub repo
# 3. Select "Web Service"
# 4. Set build command: npm install
# 5. Set start command: npm start
# 6. Add environment variable: MONGODB_URI
```

**Railway:**
```powershell
# 1. Install Railway CLI
npm install -g railway

# 2. Login
railway login

# 3. Initialize and deploy
railway init
railway up
```

## Local Development with Netlify Dev

To test locally with Netlify environment:

```powershell
# Start Netlify Dev server
netlify dev
```

This will:
- Start your Node.js server on port 3000
- Proxy through Netlify's local server
- Simulate the production environment

## Current Setup

✅ **Already Configured:**
- `netlify.toml` - Netlify configuration
- `.gitignore` - Excludes node_modules and .env
- npm scripts for deployment

✅ **Running Locally:**
```powershell
npm start
```
Access at: http://localhost:3000

## Environment Variables

If deploying to Netlify/Render/Railway, add these:

```
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key_here
PORT=3000
```

## What's Next?

Choose your path:

1. **Just local development?** → Use `npm start`
2. **Want to share with others?** → Deploy to Render.com (easiest)
3. **Must use Netlify?** → Convert to serverless (complex)

Let me know which option you'd like to proceed with!
