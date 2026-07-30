const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Requerido para encriptar la contraseña
require('dotenv').config();

const User = require('./models/User');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Función para crear o actualizar la cuenta de la dueña en la BD
const initAdmin = async () => {
  try {
    const adminEmail = 'cosmetics.beauty.ambar@gmail.com';
    const adminPassword = 'ambar123456';

    // Buscamos si ya existe
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      await User.create({
        name: 'Dueña Ámbar Cosmetics',
        email: adminEmail,
        password: adminPassword, // Pasa directa por si el schema tiene .pre('save')
        role: 'admin',
        isAdmin: true
      });
      console.log('👑 ¡Cuenta de la Dueña creada con éxito!');
    } else {
      existingAdmin.password = adminPassword;
      existingAdmin.role = 'admin';
      existingAdmin.isAdmin = true;
      await existingAdmin.save(); // Dispara los middlewares del esquema
      console.log('🔄 ¡Cuenta de Admin re-sincronizada con éxito!');
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