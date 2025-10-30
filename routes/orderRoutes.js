const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, restrictTo } = require('../middleware/auth');

// All order routes require authentication
router.use(protect);

// Specific routes MUST come before parameterized routes
// Admin routes
router.get('/admin/all', restrictTo('admin'), orderController.getAllOrders);

// Customer routes - specific paths first
router.get('/my-orders', orderController.getMyOrders);
router.post('/create', orderController.createOrder);
router.post('/verify-payment', orderController.verifyPayment);

// Main routes
router.route('/')
  .get(orderController.getMyOrders)  // GET /api/orders - get user's orders
  .post(orderController.createOrder); // POST /api/orders - create order

// Parameterized routes LAST to avoid catching specific routes
router.get('/:id', orderController.getOrder);
router.put('/:id/status', restrictTo('admin'), orderController.updateOrderStatus);
router.put('/:id/cancel', orderController.cancelOrder);

module.exports = router;
