const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // 👤 Datos del Cliente (Compras directas o con cuenta)
  customer: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    dni: { type: String, required: true },
    taxType: { type: String, default: 'Consumidor Final' },
    address: { type: String, required: true },
    notes: { type: String, default: '' }
  },

  // 🛍️ Lista de Productos en la Orden
  items: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],

  // 💰 Totales
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },

  // 🔄 Estados de la Orden
  status: { 
    type: String, 
    enum: ['pendiente_pago', 'pagado', 'despachado', 'cancelado'],
    default: 'pendiente_pago' 
  },

  // 📦 Flag de Control: Garantiza que el stock se reduzca SÓLO al despachar
  stockDeducted: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);