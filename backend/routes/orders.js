const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');

// 1. POST /api/orders -> Crea la orden en la BD
router.post('/', async (req, res) => {
  try {
    const { customer, items, total, subtotal, discount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'El carrito no contiene productos' });
    }

    const newOrder = new Order({
      customer,
      items,
      subtotal,
      discount,
      total,
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

// 2. GET /api/orders -> Obtiene todas las órdenes para el Panel de Admin
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    return res.status(500).json({ error: 'Error al obtener la lista de órdenes' });
  }
});

// 3. PATCH /api/orders/:id -> Soporta peticiones a /:id Y a /:id/status para cambiar estado
const handleStatusUpdate = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    // 🚀 Resta el stock si pasa a "despachado" y NO se descontó anteriormente
    if (status === 'despachado' && !order.stockDeducted) {
      for (const item of order.items) {
        const productId = item.product || item._id;
        if (productId) {
          await Product.findByIdAndUpdate(productId, {
            $inc: { stock: -item.qty }
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

// Mapeamos ambas rutas para que funcione sí o sí
router.patch('/:id', handleStatusUpdate);
router.patch('/:id/status', handleStatusUpdate);

// 4. DELETE /api/orders/:id -> Elimina una orden por completo
router.delete('/:id', async (req, res) => {
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