const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect, admin } = require('../Middleware/authMiddleware');

// 1. POST /api/orders -> Crea la orden en la BD (Pública para clientes)
router.post('/', async (req, res) => {
  try {
    const { customer, items, total, subtotal, discount } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'El carrito no contiene productos válidos' });
    }

    if (!customer || !customer.nombre || !customer.telefono) {
      return res.status(400).json({ error: 'Los datos del cliente están incompletos' });
    }

    const newOrder = new Order({
      customer: {
        nombre: String(customer.nombre).trim(),
        email: customer.email ? String(customer.email).trim().toLowerCase() : '',
        telefono: String(customer.telefono).trim(),
        direccion: customer.direccion ? String(customer.direccion).trim() : ''
      },
      items,
      subtotal: Number(subtotal || 0),
      discount: Number(discount || 0),
      total: Number(total || 0),
      status: 'pendiente_pago',
      stockDeducted: false
    });

    await newOrder.save();

    return res.status(201).json({
      message: 'Orden registrada correctamente',
      orderId: newOrder._id
    });

  } catch (error) {
    console.error('Error al registrar la orden:', error);
    return res.status(500).json({ error: 'Error interno del servidor al crear la orden' });
  }
});

// 2. GET /api/orders -> Obtiene todas las órdenes (Protegida: Solo Admin)
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    return res.status(500).json({ error: 'Error al obtener la lista de órdenes' });
  }
});

// 3. PATCH /api/orders/:id -> Actualiza estado y ajusta stock (Protegida: Solo Admin)
const handleStatusUpdate = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'El estado es obligatorio' });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    // Descuenta stock automáticamente si la orden pasa a "despachado"
    if (status === 'despachado' && !order.stockDeducted) {
      for (const item of order.items) {
        const productId = item.product || item._id;
        if (productId) {
          await Product.findByIdAndUpdate(productId, {
            $inc: { stock: -Math.abs(Number(item.qty || 1)) }
          });
        }
      }
      order.stockDeducted = true;
    }

    order.status = status;
    await order.save();

    return res.json({
      message: 'Estado de la orden actualizado correctamente',
      order
    });

  } catch (error) {
    console.error('Error al actualizar el estado de la orden:', error);
    return res.status(500).json({ error: 'Error al cambiar el estado del pedido' });
  }
};

// Rutas protegidas para actualización de estado
router.patch('/:id', protect, admin, handleStatusUpdate);
router.patch('/:id/status', protect, admin, handleStatusUpdate);

// 4. DELETE /api/orders/:id -> Elimina una orden (Protegida: Solo Admin)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    
    if (!deletedOrder) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    return res.json({ message: 'Orden eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la orden:', error);
    return res.status(500).json({ error: 'Error interno al eliminar la orden' });
  }
});

module.exports = router;