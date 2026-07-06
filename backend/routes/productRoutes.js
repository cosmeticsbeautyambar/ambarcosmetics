const express = require('express');
const router = express.Router();
// Importamos getTopProducts junto con los otros controladores
const { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getTopProducts // Asegurate de exportar esto desde tu controlador
} = require('../controllers/productController');
const { protect, admin } = require('../Middleware/authMiddleware');

// Ruta para obtener los más vendidos (Sin middleware, para que sea pública)
router.get('/destacados', getTopProducts); 

// Resto de tus rutas
router.get('/', getProducts);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;