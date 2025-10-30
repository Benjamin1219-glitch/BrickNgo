const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper function to find product by slug or ID
async function findProductBySlugOrId(identifier) {
  // Check if it's a valid MongoDB ObjectId
  if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
    return await Product.findById(identifier);
  }
  
  // Slug to name mapping for known products
  const slugMappings = {
    'red-bricks': ['Premium Red Bricks', 'Red Bricks'],
    'flyash-bricks': ['Fly Ash Bricks', 'Flyash Bricks'],
    'aac-blocks': ['AAC Blocks'],
    'kankar-20mm': ['20mm Kankar', 'Kankar 20mm'],
    'kankar-10mm': ['10mm Kankar', 'Kankar 10mm'],
    'river-sand': ['Premium River Sand', 'River Sand'],
    'm-sand': ['M Sand', 'Manufactured Sand'],
    'ultratech-cement': ['UltraTech', 'Ultratech OPC'],
    'tmt-bars': ['TMT Bars', 'TMT'],
    'foundation': ['Red Bricks', 'Premium Red Bricks'],
    'wall': ['AAC Blocks'],
    'plastering': ['River Sand', 'Premium River Sand']
  };
  
  // Try known mappings first
  if (slugMappings[identifier.toLowerCase()]) {
    for (const namePattern of slugMappings[identifier.toLowerCase()]) {
      const product = await Product.findOne({
        name: new RegExp(namePattern, 'i')
      });
      if (product) return product;
    }
  }
  
  // If no mapping found, try generic search
  const searchTerms = identifier.toLowerCase().replace(/-/g, ' ');
  return await Product.findOne({
    $or: [
      { name: new RegExp(`^${searchTerms}`, 'i') },
      { name: new RegExp(searchTerms.split(' ').join('.*'), 'i') }
    ]
  });
}

// @route   GET /api/cart
// @desc    Get user's cart
exports.getCart = async (req, res) => {
  try {
    console.log('🛒 Getting cart for user:', req.user._id);
    
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product');

    console.log('🛒 Cart found:', cart ? 'Yes' : 'No');
    if (cart) {
      console.log('🛒 Items in cart:', cart.items.length);
      cart.items.forEach((item, index) => {
        console.log(`  Item ${index + 1}:`, {
          productId: item.product?._id,
          productName: item.product?.name,
          price: item.product?.price || item.price,
          quantity: item.quantity,
          populated: !!item.product
        });
      });
    }

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
      console.log('🛒 Created new empty cart');
    }

    const total = cart.calculateTotal();
    console.log('💰 Cart total:', total);

    res.status(200).json({
      success: true,
      cart,
      total
    });
  } catch (error) {
    console.error('❌ Error getting cart:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @route   POST /api/cart/add
// @desc    Add item to cart
exports.addToCart = async (req, res) => {
  try {
    let { productId, quantity = 1 } = req.body;

    // Find product by slug or ID
    const product = await findProductBySlugOrId(productId);

    // Validate product exists
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found: "${productId}". Please check the product identifier.`
      });
    }
    
    // Use the actual product ID from database
    productId = product._id;

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock'
        });
      }
      existingItem.quantity = newQuantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.price
      });
    }

    await cart.save();
    await cart.populate('items.product');

    const total = cart.calculateTotal();

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      cart,
      total
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @route   PUT /api/cart/update
// @desc    Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const item = cart.items.find(
      item => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Check stock
    const product = await Product.findById(productId);
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product');

    const total = cart.calculateTotal();

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      cart,
      total
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @route   DELETE /api/cart/remove/:productId
// @desc    Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate('items.product');

    const total = cart.calculateTotal();

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart,
      total
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @route   DELETE /api/cart/clear
// @desc    Clear entire cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
