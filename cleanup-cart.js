const mongoose = require('mongoose');
const Cart = require('./models/Cart');
const Product = require('./models/Product'); // Need to load Product model for populate

async function cleanupCart() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/building_materials');
    console.log('✅ Connected to MongoDB');

    // Find all carts
    const carts = await Cart.find().populate('items.product');
    
    console.log(`\n📦 Found ${carts.length} carts`);
    
    for (const cart of carts) {
      console.log(`\n🛒 Cart for user: ${cart.user}`);
      console.log(`   Items before cleanup: ${cart.items.length}`);
      
      // Remove items where product doesn't exist (null after populate)
      const validItems = cart.items.filter(item => {
        if (!item.product) {
          console.log(`   ❌ Removing item with null product (ID: ${item._id})`);
          return false;
        }
        console.log(`   ✅ Keeping: ${item.product.name} - ₹${item.product.price} x ${item.quantity}`);
        return true;
      });
      
      cart.items = validItems;
      await cart.save();
      
      console.log(`   Items after cleanup: ${cart.items.length}`);
    }
    
    console.log('\n✅ Cart cleanup completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

cleanupCart();
