const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // ⚠️ Asegurate de que la ruta a tu modelo Product sea correcta
const Order = require('../models/Order');     // ⚠️ Si tenés modelo de órdenes (opcional)

// POST /api/orders -> Procesa la orden y descuenta stock
router.post('/', async (req, res) => {
  try {
    const { customer, items, total, subtotal, discount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'El carrito no contiene productos' });
    }

    // 1. Descontar stock en MongoDB para cada producto
    for (const item of items) {
      await Product.findByIdAndUpdate(item._id, {
        $inc: { stock: -item.qty }
      });
    }

    // 2. Guardar la orden en la BD (opcional pero recomendado para el historial)
    let newOrder = null;
    try {
      if (Order) {
        newOrder = new Order({
          customer,
          items,
          subtotal,
          discount,
          total,
          status: 'pendiente_whatsapp',
          createdAt: new Date()
        });
        await newOrder.save();
      }
    } catch (dbError) {
      console.warn('No se pudo guardar el documento Order en DB (continuando igual):', dbError.message);
    }

    return res.status(201).json({
      message: 'Orden creada y stock actualizado correctamente',
      orderId: newOrder ? newOrder._id : null
    });

  } catch (error) {
    console.error('Error al procesar la orden en el backend:', error);
    return res.status(500).json({ error: 'Error interno del servidor al actualizar stock' });
  }
});

module.exports = router;