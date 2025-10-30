# 🧱 BrickNGo - Full-Stack E-Commerce Platform

> A complete, production-ready e-commerce platform for building materials, built with Node.js, Express, MongoDB, and modern web technologies.

![Project Status](https://img.shields.io/badge/status-production--ready-brightgreen)
![Node Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![MongoDB](https://img.shields.io/badge/database-MongoDB-green)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 🌟 Overview

**BrickNGo** is a fully functional e-commerce website similar to Flipkart/Amazon, specifically designed for selling building materials. This project demonstrates enterprise-level features including user authentication, payment processing, order management, and an admin dashboard.

### ✨ Key Highlights

- 🔐 **Secure Authentication** - JWT-based auth with bcrypt password hashing
- 🛒 **Full Shopping Cart** - Persistent cart with real-time calculations
- 💳 **Payment Integration** - Razorpay for COD, Cards, UPI, Net Banking
- 📦 **Order Management** - Complete order lifecycle tracking
- ⚙️ **Admin Dashboard** - Product & order management interface
- 🔍 **Advanced Search** - Filters, sorting, and pagination
- 📱 **Responsive Design** - Works on mobile, tablet, and desktop
- 🚀 **Production Ready** - Clean code, security best practices

---

## 📸 Screenshots

*(Add screenshots of your application here)*

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd building_materials

# 2. Install dependencies
npm install

# 3. Create .env file (see .env.example)
cp .env.example .env
# Edit .env with your configuration

# 4. Seed the database
node seed.js

# 5. Start the server
node server.js
```

### Access the Application

- **Website:** http://localhost:3000
- **Shop:** http://localhost:3000/shop
- **Admin Dashboard:** http://localhost:3000/admin-dashboard

### Default Login Credentials

**Admin:**
- Email: `admin@brickngo.com`
- Password: `admin123`

**Test Customer:**
- Email: `test@customer.com`
- Password: `test123`

---

## 📚 Documentation

- **[Quick Start Guide](QUICK_START.md)** - Get up and running in 5 minutes
- **[Complete Setup Guide](COMPLETE_SETUP_GUIDE.md)** - Comprehensive installation and deployment guide
- **[Features Documentation](FEATURES_COMPLETE.md)** - Complete list of all 150+ features
- **[API Documentation](COMPLETE_SETUP_GUIDE.md#api-documentation)** - All endpoints and examples

---

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Razorpay** - Payment gateway

### Frontend
- **EJS** - Templating engine
- **Vanilla JavaScript** - Client-side logic
- **CSS3** - Styling
- **Font Awesome** - Icons

---

## 📋 Features

### Customer Features
- ✅ User registration & login
- ✅ Browse products with images & details
- ✅ Search & filter products
- ✅ Sort by price, rating, newest
- ✅ Add to cart & manage quantities
- ✅ Secure checkout process
- ✅ Multiple payment methods (COD, Online)
- ✅ Order history & tracking
- ✅ Cancel orders
- ✅ User profile management

### Admin Features
- ✅ Admin authentication
- ✅ Dashboard with statistics
- ✅ Product management (CRUD)
- ✅ Stock management
- ✅ Order management
- ✅ Update order status
- ✅ View customer details
- ✅ Revenue analytics

### Technical Features
- ✅ RESTful API architecture
- ✅ JWT token authentication
- ✅ Session management
- ✅ Password encryption
- ✅ Input validation
- ✅ Error handling
- ✅ Security best practices
- ✅ Responsive design
- ✅ Production-ready code

---

## 📁 Project Structure

```
building_materials/
├── controllers/          # Business logic
│   ├── authController.js
│   ├── productController.js
│   ├── cartController.js
│   └── orderController.js
├── models/               # Database schemas
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   ├── Cart.js
│   └── Contact.js
├── routes/               # API routes
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   └── orderRoutes.js
├── middleware/           # Custom middleware
│   └── auth.js
├── views/                # EJS templates
│   ├── login.ejs
│   ├── signup.ejs
│   ├── shop.ejs
│   ├── cart.ejs
│   ├── checkout.ejs
│   ├── orders.ejs
│   └── admin-dashboard.ejs
├── public/               # Static files
│   ├── js/               # Client-side JavaScript
│   ├── css/              # Stylesheets
│   └── images/           # Images
├── server.js             # Main server file
├── seed.js               # Database seeding
├── package.json          # Dependencies
└── .env                  # Environment variables
```

---

## 🧪 Testing

### Complete Flow Test

1. **Customer Journey:**
   - Register new account
   - Browse products
   - Search & filter
   - Add to cart
   - Checkout with COD/Online payment
   - View orders

2. **Admin Journey:**
   - Login to admin dashboard
   - Add new product
   - Edit product (update stock, price)
   - View all orders
   - Update order status

See [Complete Setup Guide](COMPLETE_SETUP_GUIDE.md#testing-guide) for detailed testing instructions.

---

## 🌐 Deployment

### Heroku Deployment

```bash
heroku create brickngo-app
heroku config:set MONGODB_URI=<your-mongodb-uri>
heroku config:set JWT_SECRET=<your-secret>
git push heroku main
heroku open
```

### Other Platforms
- **DigitalOcean/AWS/Azure** - See [Deployment Guide](COMPLETE_SETUP_GUIDE.md#deployment)
- **Vercel/Netlify** - Frontend deployment

---

## 🔒 Security

This project implements multiple security measures:

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ HTTP-only secure cookies
- ✅ Input validation & sanitization
- ✅ Protected API routes
- ✅ Role-based access control
- ✅ Payment signature verification
- ✅ Environment variable protection

For production deployment, ensure you:
- Use strong secrets for JWT and sessions
- Enable HTTPS/SSL
- Configure CORS properly
- Use MongoDB Atlas with IP whitelisting
- Switch Razorpay to Live Mode

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/auth/logout` - Logout

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add to cart
- `PUT /api/cart/update` - Update quantity
- `DELETE /api/cart/remove/:id` - Remove item

### Orders
- `POST /api/orders/create` - Create order
- `POST /api/orders/verify-payment` - Verify payment
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/admin/all` - Get all orders (admin)
- `PUT /api/orders/:id/status` - Update status (admin)

See [API Documentation](COMPLETE_SETUP_GUIDE.md#api-documentation) for detailed examples.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🐛 Troubleshooting

**MongoDB Connection Error?**
- Ensure MongoDB is running locally, or use MongoDB Atlas
- Check `MONGODB_URI` in `.env` file

**Port Already in Use?**
- Change `PORT` in `.env` to another port (e.g., 3001)
- Or kill the process using port 3000

**Seed Script Fails?**
- Make sure MongoDB is connected
- Delete `node_modules` and run `npm install`

See [Troubleshooting Guide](COMPLETE_SETUP_GUIDE.md#troubleshooting) for more help.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- Node.js and Express.js communities
- MongoDB documentation
- Razorpay payment gateway
- Font Awesome for icons
- All open-source contributors

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: your.email@example.com
- Documentation: See guides in repository

---

## ⭐ Show Your Support

If this project helped you, please give it a ⭐ star on GitHub!

---

**Built with ❤️ using Node.js, Express, MongoDB, and modern web technologies**

*A complete, production-ready e-commerce solution - from signup to checkout!* 🚀
