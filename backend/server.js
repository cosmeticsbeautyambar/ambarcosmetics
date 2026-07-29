const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Función para crear la cuenta de la dueña si no existe en la BD
const initAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@ambarcosmetics.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Ambar2026!Admin';

    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'Dueña Ámbar Cosmetics',
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      console.log('👑 Cuenta de la Dueña (Admin) inicializada con éxito.');
    }
  } catch (error) {
    console.error('Error al inicializar cuenta admin:', error.message);
  }
};

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conexión exitosa a MongoDB Atlas 🍃');
    initAdmin(); // Ejecutamos la inicialización del Admin
  })
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Rutas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

// ALIAS para evitar 404 si el frontend llama a /api/login directamente
app.use('/api', require('./routes/authRoutes'));

app.get('/', (req, res) => {
    res.send('El servidor de Ámbar Cosmetics está funcionando correctamente 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});