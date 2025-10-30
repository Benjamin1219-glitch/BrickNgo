const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, restrictTo } = require('../middleware/auth');

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);

// Protected routes (customer)
router.post('/:id/review', protect, productController.addReview);

// Admin routes
router.post('/', protect, restrictTo('admin'), productController.createProduct);
router.put('/:id', protect, restrictTo('admin'), productController.updateProduct);
router.delete('/:id', protect, restrictTo('admin'), productController.deleteProduct);
router.put('/:id/stock', protect, restrictTo('admin'), productController.updateStock);

module.exports = router;
