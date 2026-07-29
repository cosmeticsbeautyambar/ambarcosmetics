const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());

// Aumentamos el límite a 10mb para procesar fotos de productos sin bloqueos
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conexión exitosa a MongoDB Atlas 🍃'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Rutas de la API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('El servidor de Ámbar Cosmetics está funcionando correctamente 🚀');
});

// Levantamos el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});