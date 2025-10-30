const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    price: Number,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
cartSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate total
cartSchema.methods.calculateTotal = function() {
  return this.items.reduce((total, item) => {
    // Use stored price or product price
    const price = item.price || (item.product && item.product.price) || 0;
    return total + (price * item.quantity);
  }, 0);
};

module.exports = mongoose.model('Cart', cartSchema);
