const mongoose = require('mongoose');
const Cart = require('./models/Cart');

mongoose.connect('mongodb://127.0.0.1:27017/buildingMaterials')
  .then(async () => {
    console.log('Connected to MongoDB');
    const result = await Cart.deleteMany({});
    console.log('✅ Cleared', result.deletedCount, 'carts');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
