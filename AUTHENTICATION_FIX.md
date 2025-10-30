# Authentication Fix - Cross-Origin Cookies

## Problem Identified
The login was failing because cookies weren't being sent between Netlify (frontend) and Render (backend) due to cross-origin restrictions.

## Changes Made

### 1. Updated `server.js`
Added `sameSite: 'none'` to session cookie configuration:
```javascript
cookie: { 
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
}
```

### 2. Updated `controllers/authController.js`
Added `sameSite: 'none'` to JWT token cookie:
```javascript
const cookieOptions = {
  expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
};
```

## Why This Fix Works

**Cross-Origin Cookie Requirements:**
- `secure: true` - Cookies only sent over HTTPS (required for sameSite=none)
- `sameSite: 'none'` - Allows cookies to be sent cross-origin (Netlify → Render)
- `httpOnly: true` - Prevents JavaScript access (security)

**Before Fix:**
❌ Browser blocked cookies because sameSite defaults to 'lax' in production
❌ Login succeeded on backend but cookie wasn't sent to frontend
❌ User appeared logged out on refresh
❌ Cart/protected routes failed with 401 errors

**After Fix:**
✅ Browser accepts cookies from Render backend
✅ Frontend (Netlify) can send cookies back to backend
✅ User stays logged in across requests
✅ Protected routes (cart, orders) work correctly

## Testing After Deploy

**Wait 2-3 minutes for Render to redeploy**, then test:

### 1. Test Login
```
1. Go to: https://brickngo-shop.netlify.app/login.html
2. Login with: test@customer.com / test123
3. Check if redirected and login button changes to logout
4. Refresh page - should stay logged in
```

### 2. Test Add to Cart
```
1. While logged in, click "Add to Cart" on any product
2. Should see success message
3. Cart badge should update
4. Go to cart page - products should be there
```

### 3. Check Browser Console
```
1. Press F12
2. Go to Application → Cookies
3. Should see 'token' cookie from brickngo-backend.onrender.com
4. Cookie should have Secure, HttpOnly, and SameSite=None flags
```

## If Still Not Working

Check these:
1. Render deployment completed successfully
2. Environment variable `NODE_ENV=production` is set on Render
3. Browser console shows no CORS errors
4. Token cookie appears in Application → Cookies tab
5. API calls to `/api/auth/login` return success

## Deployed
- ✅ Pushed to GitHub: commit 6916569
- ⏳ Render auto-deployment in progress (check https://dashboard.render.com/)
- ⏳ Wait 2-3 minutes then test
