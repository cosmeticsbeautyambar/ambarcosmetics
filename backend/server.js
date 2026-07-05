const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // <-- 1. Importamos Mongoose para la BD
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// 2. Conexión a MongoDB Atlas usando tu variable de entorno
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conexión exitosa a MongoDB Atlas 🍃'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// 3. Conexión de Rutas (Ahora bien ubicadas ANTES del listen)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('El servidor de Ámbar Cosmetics está funcionando correctamente 🚀');
});

// 4. Levantamos el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});