require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/building_materials';

// Sample products data
const products = [
  {
    name: 'Premium Red Bricks',
    description: 'High-quality clay fired bricks, perfect for construction. Durable and weather-resistant.',
    category: 'Bricks',
    price: 8,
    unit: 'per brick',
    stock: 50000,
    image: '/images/Premium Red Bricks.png',
    images: ['/images/Premium Red Bricks.png'],
    specifications: {
      dimensions: '230 x 110 x 75 mm',
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
    description: 'Eco-friendly fly ash bricks with superior strength and thermal insulation.',
    category: 'Bricks',
    price: 6,
    unit: 'per brick',
    stock: 60000,
    image: '/images/Fly Ash Bricks.png',
    images: ['/images/Fly Ash Bricks.png'],
    specifications: {
      dimensions: '230 x 110 x 75 mm',
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
    description: 'Autoclaved Aerated Concrete blocks - lightweight, energy-efficient building material.',
    category: 'Blocks',
    price: 65,
    unit: 'per block',
    stock: 10000,
    image: '/images/AAC Blocks.png',
    images: ['/images/AAC Blocks.png'],
    specifications: {
      dimensions: '600 x 200 x 100 mm',
      weight: '6.5 kg',
      material: 'AAC',
      color: 'White'
    },
    rating: { average: 4.7, count: 423 },
    featured: true,
    active: true
  },
  {
    name: '20mm Kankar (Aggregate)',
    description: 'Premium quality 20mm crushed stone aggregate for concrete mix.',
    category: 'Aggregates',
    price: 2800,
    unit: 'per load',
    stock: 500,
    image: '/images/20mm Kankar (Aggregate).png',
    images: ['/images/20mm Kankar (Aggregate).png'],
    specifications: {
      dimensions: '20mm size',
      weight: '1400 kg per load',
      material: 'Crushed Stone',
      color: 'Grey'
    },
    rating: { average: 4.4, count: 234 },
    featured: false,
    active: true
  },
  {
    name: 'Premium River Sand',
    description: 'Natural river sand ideal for plastering, masonry, and concrete work.',
    category: 'Sand',
    price: 1200,
    unit: 'per tractor',
    stock: 300,
    image: '/images/Premium River Sand.png',
    images: ['/images/Premium River Sand.png'],
    specifications: {
      dimensions: 'Fine grade',
      weight: '2000 kg per tractor',
      material: 'River Sand',
      color: 'Beige'
    },
    rating: { average: 4.6, count: 567 },
    featured: true,
    active: true
  },
  {
    name: 'M Sand (Manufactured Sand)',
    description: 'High-quality manufactured sand - consistent quality alternative to river sand.',
    category: 'Sand',
    price: 1000,
    unit: 'per tractor',
    stock: 400,
    image: '/images/M Sand (Manufactured Sand).png',
    images: ['/images/M Sand (Manufactured Sand).png'],
    specifications: {
      dimensions: 'Fine grade',
      weight: '2000 kg per tractor',
      material: 'Manufactured Sand',
      color: 'Grey'
    },
    rating: { average: 4.5, count: 389 },
    featured: false,
    active: true
  },
  {
    name: 'UltraTech OPC 53 Grade Cement',
    description: 'Premium quality Ordinary Portland Cement for superior strength and durability.',
    category: 'Cement',
    price: 380,
    unit: 'per bag',
    stock: 5000,
    image: '/images/UltraTech OPC 53 Grade Cement.png',
    images: ['/images/UltraTech OPC 53 Grade Cement.png'],
    specifications: {
      dimensions: '50 kg bag',
      weight: '50 kg',
      material: 'OPC 53 Grade',
      color: 'Grey'
    },
    rating: { average: 4.8, count: 1234 },
    featured: true,
    active: true
  },
  {
    name: 'TMT Bars Fe 500D',
    description: 'High-strength thermo-mechanically treated steel bars for RCC construction.',
    category: 'Steel',
    price: 52,
    unit: 'per kg',
    stock: 50000,
    image: '/images/TMT Bars Fe 500D.png',
    images: ['/images/TMT Bars Fe 500D.png'],
    specifications: {
      dimensions: 'Various sizes available',
      weight: 'Per kg',
      material: 'Fe 500D TMT',
      color: 'Black'
    },
    rating: { average: 4.7, count: 876 },
    featured: true,
    active: true
  },
  {
    name: '10mm Kankar (Aggregate)',
    description: 'Fine 10mm crushed stone aggregate for concrete and road construction.',
    category: 'Aggregates',
    price: 2600,
    unit: 'per load',
    stock: 450,
    image: '/images/10mm Kankar (Aggregate).png',
    images: ['/images/10mm Kankar (Aggregate).png'],
    specifications: {
      dimensions: '10mm size',
      weight: '1400 kg per load',
      material: 'Crushed Stone',
      color: 'Grey'
    },
    rating: { average: 4.3, count: 198 },
    featured: false,
    active: true
  },
  {
    name: 'Concrete Hollow Blocks',
    description: 'Lightweight hollow concrete blocks for partition walls and non-load bearing structures.',
    category: 'Blocks',
    price: 35,
    unit: 'per block',
    stock: 15000,
    image: '/images/Concrete Hollow Blocks.png',
    images: ['/images/Concrete Hollow Blocks.png'],
    specifications: {
      dimensions: '400 x 200 x 200 mm',
      weight: '12 kg',
      material: 'Concrete',
      color: 'Grey'
    },
    rating: { average: 4.4, count: 345 },
    featured: false,
    active: true
  },
  {
    name: 'Birla White Cement',
    description: 'Premium white cement for finishing work, tile fixing, and decorative applications.',
    category: 'Cement',
    price: 560,
    unit: 'per bag',
    stock: 2000,
    image: '/images/Birla White Cement.png',
    images: ['/images/Birla White Cement.png'],
    specifications: {
      dimensions: '40 kg bag',
      weight: '40 kg',
      material: 'White Cement',
      color: 'White'
    },
    rating: { average: 4.6, count: 567 },
    featured: false,
    active: true
  },
  {
    name: 'Binding Wire',
    description: 'Annealed mild steel binding wire for tying reinforcement bars in construction.',
    category: 'Steel',
    price: 48,
    unit: 'per kg',
    stock: 10000,
    image: '/images/Binding Wire.png',
    images: ['/images/Binding Wire.png'],
    specifications: {
      dimensions: '18 gauge',
      weight: 'Per kg',
      material: 'Mild Steel',
      color: 'Black'
    },
    rating: { average: 4.2, count: 234 },
    featured: false,
    active: true
  }
];

async function seedDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    console.log('🗑️  Clearing existing products...');
    await Product.deleteMany({});
    console.log('✅ Products cleared');

    // Insert new products
    console.log('📦 Inserting products...');
    await Product.insertMany(products);
    console.log(`✅ Inserted ${products.length} products`);

    // Create admin user if doesn't exist
    console.log('👤 Creating admin user...');
    const existingAdmin = await User.findOne({ email: 'admin@brickngo.com' });
    if (!existingAdmin) {
      await User.create({
        name: 'Admin',
        email: 'admin@brickngo.com',
        password: 'admin123',
        phone: '9999999999',
        role: 'admin'
      });
      console.log('✅ Admin user created (email: admin@brickngo.com, password: admin123)');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Create test customer
    console.log('👤 Creating test customer...');
    const existingCustomer = await User.findOne({ email: 'test@customer.com' });
    if (!existingCustomer) {
      await User.create({
        name: 'Test Customer',
        email: 'test@customer.com',
        password: 'test123',
        phone: '8888888888',
        role: 'customer'
      });
      console.log('✅ Test customer created (email: test@customer.com, password: test123)');
    } else {
      console.log('ℹ️  Test customer already exists');
    }

    console.log('\n✨ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Products: ${products.length}`);
    console.log('   - Admin: admin@brickngo.com (password: admin123)');
    console.log('   - Customer: test@customer.com (password: test123)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
