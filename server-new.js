const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// CORS
app.use(cors({
  origin: true,
  credentials: true
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ============================================
// DATABASE CONNECTION
// ============================================

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/building_materials';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  initializeDatabase();
})
.catch((err) => {
  console.log('⚠️  MongoDB connection error:', err.message);
  console.log('   Make sure MongoDB is installed and running');
  console.log('   Installation: https://www.mongodb.com/try/download/community');
});

// ============================================
// INITIALIZE DATABASE WITH SAMPLE DATA
// ============================================

async function initializeDatabase() {
  try {
    const Product = require('./models/Product');
    const User = require('./models/User');
    
    // Check if products exist
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('📦 Initializing database with sample products...');
      
      const sampleProducts = [
        {
          name: 'Premium Red Bricks',
          description: 'High-quality clay fired bricks, perfect for construction. Weather-resistant and durable.',
          category: 'Bricks',
          price: 8,
          unit: 'per brick',
          stock: 50000,
          image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=600',
          images: ['https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=600'],
          specifications: {
            dimensions: '230mm x 110mm x 75mm',
            weight: '3.2 kg',
            material: 'Clay',
            color: 'Red'
          },
          rating: { average: 4.5, count: 892 },
          featured: true,
          active: true
        },
        {
          name: 'Fly Ash Bricks',
          description: 'Eco-friendly fly ash bricks. Lightweight and cost-effective building material.',
          category: 'Bricks',
          price: 6,
          unit: 'per brick',
          stock: 40000,
          image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600',
          images: ['https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600'],
          specifications: {
            dimensions: '230mm x 110mm x 75mm',
            weight: '2.8 kg',
            material: 'Fly Ash',
            color: 'Grey'
          },
          rating: { average: 4.3, count: 654 },
          featured: true,
          active: true
        },
        {
          name: 'AAC Blocks',
          description: 'Autoclaved Aerated Concrete blocks. Lightweight, thermal insulation properties.',
          category: 'Blocks',
          price: 65,
          unit: 'per block',
          stock: 15000,
          image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600',
          images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600'],
          specifications: {
            dimensions: '600mm x 200mm x 200mm',
            weight: '18 kg',
            material: 'AAC',
            color: 'White'
          },
          rating: { average: 4.7, count: 423 },
          featured: true,
          active: true
        },
        {
          name: '20mm Kankar Aggregates',
          description: 'Premium quality 20mm kankar for concrete mixing. High strength and durability.',
          category: 'Aggregates',
          price: 2800,
          unit: 'per load',
          stock: 500,
          image: 'https://images.unsplash.com/photo-1564424224827-cd24b8915874?w=600',
          images: ['https://images.unsplash.com/photo-1564424224827-cd24b8915874?w=600'],
          specifications: {
            dimensions: '20mm',
            material: 'Natural Stone',
            color: 'Grey'
          },
          rating: { average: 4.4, count: 234 },
          featured: false,
          active: true
        },
        {
          name: 'Premium River Sand',
          description: 'Clean, washed river sand for construction. Ideal for plastering and concrete.',
          category: 'Sand',
          price: 1200,
          unit: 'per tractor',
          stock: 300,
          image: 'https://images.unsplash.com/photo-1508766206392-8bd5cf550d1c?w=600',
          images: ['https://images.unsplash.com/photo-1508766206392-8bd5cf550d1c?w=600'],
          specifications: {
            material: 'River Sand',
            color: 'Beige'
          },
          rating: { average: 4.6, count: 567 },
          featured: false,
          active: true
        },
        {
          name: 'M Sand (Manufactured Sand)',
          description: 'Manufactured sand for construction. Consistent quality and eco-friendly.',
          category: 'Sand',
          price: 1000,
          unit: 'per tractor',
          stock: 400,
          image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600',
          images: ['https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600'],
          specifications: {
            material: 'Manufactured Sand',
            color: 'Grey'
          },
          rating: { average: 4.5, count: 445 },
          featured: false,
          active: true
        },
        {
          name: 'UltraTech OPC 53 Grade Cement',
          description: 'Premium quality cement from UltraTech. High strength and durability.',
          category: 'Cement',
          price: 380,
          unit: 'per bag',
          stock: 2000,
          image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600',
          images: ['https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600'],
          specifications: {
            weight: '50 kg',
            material: 'OPC 53 Grade'
          },
          rating: { average: 4.8, count: 1234 },
          featured: true,
          active: true
        },
        {
          name: 'TMT Bars Fe 500D',
          description: 'High strength TMT bars for construction. Earthquake resistant.',
          category: 'Steel',
          price: 52,
          unit: 'per kg',
          stock: 50000,
          image: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=600',
          images: ['https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=600'],
          specifications: {
            material: 'Fe 500D Steel'
          },
          rating: { average: 4.7, count: 678 },
          featured: true,
          active: true
        },
        {
          name: '10mm Kankar Aggregates',
          description: 'Fine 10mm kankar for concrete and plastering work.',
          category: 'Aggregates',
          price: 2600,
          unit: 'per load',
          stock: 450,
          image: 'https://images.unsplash.com/photo-1531685250784-7569952593d2?w=600',
          images: ['https://images.unsplash.com/photo-1531685250784-7569952593d2?w=600'],
          specifications: {
            dimensions: '10mm',
            material: 'Natural Stone'
          },
          rating: { average: 4.3, count: 189 },
          featured: false,
          active: true
        },
        {
          name: 'Concrete Hollow Blocks',
          description: 'Strong hollow blocks for partition walls. Cost-effective solution.',
          category: 'Blocks',
          price: 35,
          unit: 'per block',
          stock: 20000,
          image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600',
          images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600'],
          specifications: {
            dimensions: '400mm x 200mm x 200mm',
            weight: '16 kg',
            material: 'Concrete'
          },
          rating: { average: 4.2, count: 345 },
          featured: false,
          active: true
        },
        {
          name: 'Birla White Cement',
          description: 'Premium white cement for smooth finishes and decorative work.',
          category: 'Cement',
          price: 560,
          unit: 'per bag',
          stock: 1000,
          image: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=600',
          images: ['https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=600'],
          specifications: {
            weight: '40 kg',
            material: 'White Cement',
            color: 'White'
          },
          rating: { average: 4.9, count: 789 },
          featured: false,
          active: true
        },
        {
          name: 'Binding Wire',
          description: 'High-quality binding wire for construction reinforcement work.',
          category: 'Steel',
          price: 48,
          unit: 'per kg',
          stock: 10000,
          image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600',
          images: ['https://images.unsplash.com/photo-1563089145-599997674d42?w=600'],
          specifications: {
            material: 'Steel Wire'
          },
          rating: { average: 4.4, count: 234 },
          featured: false,
          active: true
        }
      ];
      
      await Product.insertMany(sampleProducts);
      console.log('✅ Sample products added successfully');
    }
    
    // Check if admin user exists
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      console.log('👤 Creating admin user...');
      await User.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@brickngo.com',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        phone: '9999999999',
        role: 'admin'
      });
      console.log('✅ Admin user created');
      console.log(`   Email: ${process.env.ADMIN_EMAIL || 'admin@brickngo.com'}`);
      console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    }
    
  } catch (error) {
    console.log('⚠️  Error initializing database:', error.message);
  }
}

// ============================================
// API ROUTES
// ============================================

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// ============================================
// FRONTEND ROUTES
// ============================================

const { optionalAuth } = require('./middleware/auth');

// Home page
app.get('/', optionalAuth, (req, res) => {
  res.render('index-new', { user: req.user || null });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`\n📝 API Documentation:`);
  console.log(`   Auth:     http://localhost:${PORT}/api/auth`);
  console.log(`   Products: http://localhost:${PORT}/api/products`);
  console.log(`   Cart:     http://localhost:${PORT}/api/cart`);
  console.log(`   Orders:   http://localhost:${PORT}/api/orders`);
  console.log(`\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('⚠️  UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
