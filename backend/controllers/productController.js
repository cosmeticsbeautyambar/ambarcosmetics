const Product = require('../models/Product');

// Función auxiliar para escapar caracteres especiales en expresiones regulares (Evita ataques ReDoS)
const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

// Obtener todos los productos (con búsqueda segura y filtros)
exports.getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;
    let filter = {};

    if (search && search.trim() !== '') {
      const safeSearch = escapeRegex(search.trim());
      filter.name = { $regex: safeSearch, $options: 'i' };
    }
    
    if (category && category !== 'Todas') {
      filter.category = category;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error interno al obtener los productos' });
  }
};

// Obtener productos destacados
exports.getTopProducts = async (req, res) => {
  try {
    const topProducts = await Product.find({})
      .sort({ salesCount: -1 })
      .limit(6);
    res.json(topProducts);
  } catch (error) {
    console.error('Error al obtener productos destacados:', error);
    res.status(500).json({ message: 'Error interno al obtener productos destacados' });
  }
};

// Crear producto (Admin / Dueña)
exports.createProduct = async (req, res) => {
  try {
    const { 
      name, 
      category, 
      description, 
      priceRetail, 
      price, 
      priceWholesale, 
      minWholesaleQty,
      isWholesale,
      stock, 
      image, 
      destacado 
    } = req.body;

    if (!name || !category) {
      return res.status(400).json({ message: 'El nombre y la categoría son obligatorios' });
    }

    const finalRetailPrice = Number(priceRetail || price || 0);
    const finalWholesalePrice = Number(priceWholesale || 0);

    const productData = {
      name: name.trim(),
      category: category.trim(),
      description: description ? description.trim() : '',
      price: finalRetailPrice,
      priceRetail: finalRetailPrice,
      priceWholesale: finalWholesalePrice,
      minWholesaleQty: Number(minWholesaleQty || 1),
      isWholesale: isWholesale !== undefined ? Boolean(isWholesale) : finalWholesalePrice > 0,
      stock: Number(stock || 0),
      image: image || '',
      destacado: Boolean(destacado),
      salesCount: 0
    };

    const product = new Product(productData);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("❌ Error interno al crear producto:", error);
    res.status(500).json({ message: 'Error interno al crear el producto' });
  }
};

// Actualizar producto (Admin / Dueña)
exports.updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (updateData.priceRetail || updateData.price) {
      const finalPrice = Number(updateData.priceRetail || updateData.price);
      updateData.price = finalPrice;
      updateData.priceRetail = finalPrice;
    }

    if (updateData.priceWholesale !== undefined) {
      updateData.priceWholesale = Number(updateData.priceWholesale || 0);
    }

    if (updateData.minWholesaleQty !== undefined) {
      updateData.minWholesaleQty = Number(updateData.minWholesaleQty || 1);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ message: 'Error interno al actualizar el producto' });
  }
};

// Eliminar producto (Admin / Dueña)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ message: 'Error interno al eliminar el producto' });
  }
};