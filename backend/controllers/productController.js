const Product = require('../models/Product');

// Obtener todos los productos (con opción de búsqueda)
exports.getProducts = async (req, res) => {
  try {
    const keyword = req.query.search ? {
      name: { $regex: req.query.search, $options: 'i' }
    } : {};
    const products = await Product.find({ ...keyword });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos' });
  }
};

// Crear producto (Admin)
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear producto' });
  }
};

// Actualizar producto/precio (Admin)
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar producto' });
  }
};

// Dar de baja/Eliminar producto (Admin)
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Producto eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto' });
  }
};