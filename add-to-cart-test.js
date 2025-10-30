const mongoose = require('mongoose');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const User = require('./models/User');

async function addProductsToCart() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/building_materials');
    console.log('✅ Connected to MongoDB');

    // Check products
    const productCount = await Product.countDocuments();
    console.log(`\n📦 Found ${productCount} products in database`);

    if (productCount === 0) {
      console.log('❌ No products found! Run: node seed.js');
      process.exit(1);
    }

    // Get first 3 products
    const products = await Product.find().limit(3);
    console.log('\nProducts:');
    products.forEach(p => console.log(`  - ${p.name} (₹${p.price})`));

    // Find test user
    const user = await User.findOne({ email: 'test@customer.com' });
    if (!user) {
      console.log('\n❌ Test user not found! Please login first.');
      process.exit(1);
    }
    console.log(`\n👤 User: ${user.name} (${user.email})`);

    // Find or create cart
    let cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      cart = await Cart.create({ user: user._id, items: [] });
      console.log('🛒 Created new cart');
    } else {
      console.log('🛒 Found existing cart');
    }

    // Add products to cart
    console.log('\n➕ Adding products to cart...');
    for (const product of products) {
      const existingItem = cart.items.find(
        item => item.product.toString() === product._id.toString()
      );

      if (existingItem) {
        existingItem.quantity += 1;
        console.log(`  ✓ Updated ${product.name} - Qty: ${existingItem.quantity}`);
      } else {
        cart.items.push({
          product: product._id,
          quantity: 2,
          price: product.price
        });
        console.log(`  ✓ Added ${product.name} - Qty: 2 - ₹${product.price}`);
      }
    }

    await cart.save();
    await cart.populate('items.product');

    const total = cart.calculateTotal();
    console.log(`\n💰 Cart Total: ₹${total}`);
    console.log(`📦 Total items: ${cart.items.length}`);
    
    console.log('\n✅ Cart updated successfully!');
    console.log('Now go to: http://localhost:3000/checkout');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addProductsToCart();
