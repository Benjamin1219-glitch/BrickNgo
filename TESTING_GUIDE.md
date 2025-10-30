# 🧪 Session Management Testing Guide

## ✅ All Fixes Applied

### **What Was Fixed:**

1. ✅ Added `cookie-parser` middleware to server.js
2. ✅ Fixed `authController.getMe()` to use `req.user._id` instead of `req.user.id`
3. ✅ Fixed `authController.updateProfile()` and `changePassword()` to use `req.user._id`
4. ✅ Enhanced session-manager.js with better error handling and logging
5. ✅ Created session test page for debugging

---

## 🧪 Testing Steps

### **Test 1: Session Debug Page** (Recommended First)

1. Open your browser
2. Go to: **http://localhost:3000/session-test**
3. You'll see a test dashboard showing:
   - Current session status
   - Cookie information  
   - API test buttons

4. **Click "Test Login"** button
   - Should show login response with user data
   - Session status should change to "LOGGED IN"
   
5. **Click "Test /api/auth/me"** button
   - Should return your user information
   - Status should be 200 ✅

6. **Click "Go to Home"** button
   - Should navigate to homepage
   - Login button should disappear
   - User menu should appear with your name

---

### **Test 2: Full Login Flow**

1. **Open in Incognito/Private Window** (to ensure clean session)
2. Go to: **http://localhost:3000**
3. Observe:
   - ✅ "Login" button visible in navigation
   - ✅ User menu NOT visible

4. **Click "Login"** button
5. Enter credentials:
   - Email: `test@customer.com`
   - Password: `test123`
   
6. **Click "Login"**
7. After successful login:
   - ✅ Redirects to homepage
   - ✅ Login button **disappears**
   - ✅ User menu appears: **"Test Customer ▼"**
   - ✅ Welcome message: **"Welcome back, Test!"**
   
8. **Hover over user menu** to see dropdown with:
   - My Orders
   - My Cart
   - Logout

---

### **Test 3: Session Persistence**

1. Login to your account (if not already)
2. Verify you see user menu with your name
3. **Refresh the page (F5)**
4. Expected result:
   - ✅ Still logged in
   - ✅ User menu still visible
   - ✅ No login button

5. **Close browser completely**
6. **Reopen browser**
7. Go to: **http://localhost:3000**
8. Expected result:
   - ✅ STILL logged in (session persists!)
   - ✅ User menu visible
   - ✅ Cart items preserved

---

### **Test 4: Cart Functionality**

1. **Login** to your account
2. Go to **Shop** page
3. **Add products to cart**
4. Expected results:
   - ✅ "Product added to cart!" message
   - ✅ Cart badge updates (shows number)
   - ✅ NO "Please login" error

5. **Refresh the page**
6. Check cart badge:
   - ✅ Still shows correct count

7. **Go to Cart page**
8. Expected:
   - ✅ Your items are there
   - ✅ Linked to your account

---

### **Test 5: Logout & Re-login**

1. While logged in, **hover over user menu**
2. **Click "Logout"**
3. Expected results:
   - ✅ "Logged out successfully!" message
   - ✅ User menu disappears
   - ✅ Login button reappears
   - ✅ Redirects to homepage

4. **Login again** with same credentials
5. **Go to Cart**
6. Expected:
   - ✅ Previous cart items are back!
   - ✅ Order history preserved

---

### **Test 6: Admin Access**

1. **Logout** if logged in
2. **Login as admin:**
   - Email: `admin@brickngo.com`
   - Password: `admin123`

3. After login:
   - ✅ User menu shows "Admin"
   - ✅ Dropdown includes "Admin Dashboard" option
   - ✅ Can access admin panel

4. **Click "Admin Dashboard"**
5. Expected:
   - ✅ Access granted
   - ✅ Can manage products and orders

---

### **Test 7: Multiple Browser Tabs**

1. **Login** in one tab
2. **Open new tab** → Go to http://localhost:3000
3. Expected:
   - ✅ Already logged in (no need to login again)
   - ✅ User menu visible in both tabs

4. **Add item to cart** in Tab 1
5. **Refresh Tab 2**
6. Expected:
   - ✅ Cart badge updates in both tabs
   - ✅ Items synchronized

---

## 🐛 Troubleshooting

### **Issue: Still seeing "Please login to add items to cart"**

**Solution:**
1. Clear browser cache and cookies
2. Go to http://localhost:3000/session-test
3. Click "Test Login"
4. Check if session status shows "LOGGED IN"
5. If yes, try adding to cart again
6. If no, check browser console for errors

### **Issue: Login button still visible after login**

**Solution:**
1. Hard refresh: **Ctrl + Shift + R** (or Cmd + Shift + R on Mac)
2. Clear browser cache
3. Open browser DevTools (F12)
4. Go to Console tab
5. Look for message: "✅ User session loaded: [Your Name]"
6. If not there, check Network tab for /api/auth/me request

### **Issue: Session not persisting**

**Solution:**
1. Check if cookies are enabled in browser
2. Go to: chrome://settings/cookies (Chrome) or about:preferences#privacy (Firefox)
3. Ensure cookies are not blocked
4. Check browser DevTools → Application → Cookies
5. Look for `token` cookie

### **Issue: Cart not updating**

**Solution:**
1. Ensure MongoDB is running
2. Check server terminal for connection errors
3. Go to http://localhost:3000/session-test
4. Test if logged in
5. Check browser console for API errors

---

## 📊 What to Look For

### **In Browser Console (F12):**

When page loads, you should see:
```
✅ User session loaded: Test Customer
```

If not logged in:
```
ℹ️ No active session
```

### **In Network Tab (F12 → Network):**

After login:
- `/api/auth/login` → Status 200
- Response includes `user` object and `token`

On page load:
- `/api/auth/me` → Status 200 (if logged in)
- `/api/auth/me` → Status 401 (if not logged in)

### **In Application Tab (F12 → Application → Cookies):**

You should see:
- Cookie name: `token`
- HttpOnly: ✅ (checked)
- Secure: (depends on HTTPS)
- Expires: ~30 days from now

---

## ✨ Expected Behavior Summary

### **Guest Users (Not Logged In):**
```
Navigation: [Home] [Shop] [Cart] [Orders] [Login 👤]
- Can browse products
- Cannot add to cart (redirected to login)
- No user menu
```

### **Logged-In Users:**
```
Navigation: [Home] [Shop] [Cart] [Orders] [Test Customer ▼ 🛒(2)]
                                           ├── My Orders
                                           ├── My Cart  
                                           └── Logout

Homepage: "👋 Welcome back, Test!" message
- Can add products to cart
- Cart persists across sessions
- Can place orders
- Can view order history
```

### **Admin Users:**
```
Same as regular users + Admin Dashboard access
User menu includes:
├── My Orders
├── My Cart
├── Admin Dashboard ⚙️
└── Logout
```

---

## 🎯 Quick Checklist

Before testing, ensure:
- ✅ MongoDB is running
- ✅ Server is running (http://localhost:3000)
- ✅ Database is seeded (`node seed.js`)
- ✅ Browser cookies enabled
- ✅ No browser extensions blocking cookies

After login, verify:
- ✅ Login button disappears
- ✅ User menu appears with name
- ✅ Welcome message shows
- ✅ Can add to cart without "Please login" error
- ✅ Cart badge updates
- ✅ Session persists after refresh
- ✅ Logout works correctly

---

## 🚀 Success Criteria

Your session management is working correctly if:

1. ✅ Login redirects to home and shows user menu
2. ✅ Login button disappears after successful login
3. ✅ User menu shows correct name from database
4. ✅ Welcome message appears on homepage
5. ✅ Cart functionality works without login prompts
6. ✅ Cart badge shows correct item count
7. ✅ Session persists across page reloads
8. ✅ Session persists after browser close/reopen
9. ✅ Cart items persist after logout/login
10. ✅ Logout clears session and shows login button again

---

## 📱 Test on Mobile (Optional)

1. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Open on phone: `http://[YOUR_IP]:3000`
3. Test same flows as above
4. Verify mobile responsive UI

---

**All tests should pass! If any test fails, check the Troubleshooting section above.** 🎉
