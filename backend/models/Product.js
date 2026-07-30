const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  priceRetail: { type: Number, required: true },      // Precio Minorista
  priceWholesale: { type: Number, required: true },   // Precio Mayorista
  minWholesaleQty: { type: Number, default: 6 },      // Mínimo de unidades para precio mayorista
  image: { type: String, required: true },            // Foto miniatura (Catálogo / Home)
  detailImage: { type: String, default: '' },         // 🌟 Nueva: Foto grande para el Pop-up / Detalle
  category: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  salesCount: { type: Number, default: 0 },           // Contador de ventas para el ranking
  destacado: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);