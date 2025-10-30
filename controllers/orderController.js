const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_key_secret'
});

// @route   POST /api/orders/create
// @desc    Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    console.log('📦 Creating order for user:', req.user._id);
    console.log('📍 Shipping address:', shippingAddress);
    console.log('💳 Payment method:', paymentMethod);

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    
    console.log('🛒 Cart found:', cart ? 'Yes' : 'No');
    console.log('🛒 Cart items count:', cart ? cart.items.length : 0);
    
    if (!cart || cart.items.length === 0) {
      console.log('❌ Cart is empty');
      return res.status(400).json({
        success: false,
        message: 'Cart is empty. Please add items to your cart before placing an order.'
      });
    }

    // Validate stock for all items
    for (const item of cart.items) {
      if (!item.product) {
        console.log('❌ Product not found for item:', item);
        return res.status(400).json({
          success: false,
          message: 'Some products in your cart are no longer available'
        });
      }
      
      if (item.product.stock < item.quantity) {
        console.log('❌ Insufficient stock for:', item.product.name);
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.product.name}`
        });
      }
    }

    // Calculate totals
    const subtotal = cart.calculateTotal();
    console.log('💰 Subtotal:', subtotal);
    
    if (subtotal === 0) {
      console.log('❌ Subtotal is 0');
      return res.status(400).json({
        success: false,
        message: 'Cart total is ₹0. Please add valid items to your cart.'
      });
    }
    
    const tax = subtotal * 0.18; // 18% GST
    const shippingCharge = subtotal > 5000 ? 0 : 200; // Free shipping above ₹5000
    const total = subtotal + tax + shippingCharge;

    console.log('💰 Tax:', tax);
    console.log('🚚 Shipping:', shippingCharge);
    console.log('💰 Total:', total);

    // Prepare order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
      subtotal: item.product.price * item.quantity
    }));

    // Generate order number
    const orderNumber = 'ORD' + Date.now() + Math.floor(Math.random() * 1000);
    console.log('📝 Order number:', orderNumber);

    // Create order object
    const orderData = {
      orderNumber: orderNumber,
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      shippingCharge,
      total,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    };

    // For COD, create order directly
    if (paymentMethod === 'cod') {
      const order = await Order.create(orderData);
      
      // Update product stock
      for (const item of cart.items) {
        await Product.findByIdAndUpdate(item.product._id, {
          $inc: { stock: -item.quantity }
        });
      }

      // Clear cart
      cart.items = [];
      await cart.save();

      // Update order status history
      order.statusHistory.push({
        status: 'confirmed',
        timestamp: new Date(),
        note: 'Order confirmed - Cash on Delivery'
      });
      await order.save();

      return res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        order
      });
    }

    // For online payment, create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100), // Amount in paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        address: shippingAddress.city
      }
    });

    orderData.paymentDetails = {
      razorpayOrderId: razorpayOrder.id
    };

    const order = await Order.create(orderData);

    res.status(201).json({
      success: true,
      message: 'Order created, proceed to payment',
      order,
      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id'
      }
    });
  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create order'
    });
  }
};

// @route   POST /api/orders/verify-payment
// @desc    Verify Razorpay payment
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, razorpayPaymentId, razorpaySignature } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify signature
    const text = order.paymentDetails.razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'your_key_secret')
      .update(text)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      order.paymentStatus = 'failed';
      await order.save();
      
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Payment verified successfully
    order.paymentStatus = 'paid';
    order.paymentDetails.razorpayPaymentId = razorpayPaymentId;
    order.paymentDetails.razorpaySignature = razorpaySignature;
    order.status = 'confirmed';
    order.statusHistory.push({
      status: 'confirmed',
      timestamp: new Date(),
      note: 'Payment received and verified'
    });

    await order.save();

    // Update product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear user's cart
    await Cart.findOneAndUpdate(
      { user: order.user },
      { items: [] }
    );

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @route   GET /api/orders
// @desc    Get user's orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @route   GET /api/orders/:id
// @desc    Get single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product')
      .populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @route   GET /api/orders/admin/all (Admin only)
// @desc    Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const totalOrders = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      totalOrders,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @route   PUT /api/orders/:id/status (Admin only)
// @desc    Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Status updated to ${status}`
    });

    if (status === 'delivered') {
      order.deliveredAt = new Date();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @route   POST /api/orders/:id/cancel
// @desc    Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Can only cancel pending or confirmed orders
    if (['processing', 'shipped', 'delivered'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order in current status'
      });
    }

    order.status = 'cancelled';
    order.statusHistory.push({
      status: 'cancelled',
      timestamp: new Date(),
      note: 'Order cancelled by user'
    });

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
