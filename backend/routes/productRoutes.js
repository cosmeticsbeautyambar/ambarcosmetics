const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getTopProducts 
} = require('../controllers/productController');
const { protect, admin } = require('../Middleware/authMiddleware');

// Rutas Públicas (Clientes)
router.get('/destacados', getTopProducts); 
router.get('/', getProducts);

// Rutas Protegidas (Solo la Dueña con token Admin)
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;