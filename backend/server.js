const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const User = require('./models/User');

const app = express();

// CONFIGURACIÓN DE CONFIANZA EN PROXY (Necesario para Render y express-rate-limit)
app.set('trust proxy', 1);

// 1. ENCABEZADOS DE SEGURIDAD (Helmet)
app.use(helmet());

// 2. CONFIGURACIÓN DE CORS RESTRINGIDO
const allowedOrigins = [
  'https://ambarcosmetics.onrender.com', // 🚀 Tu Frontend en Render
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL // URL adicional si la tenés en .env
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado por políticas de CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 3. RATE LIMITING (Prevención de ataques de fuerza bruta / sobrecarga)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, // Máximo 200 peticiones por IP
  message: { message: 'Demasiadas peticiones desde esta IP. Intente de nuevo más tarde.' }
});
app.use('/api/', limiter);

// Limite más estricto para inicio de sesión
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // Máximo 10 intentos de login cada 15 minutos
  message: { message: 'Demasiados intentos de acceso. Intente en 15 minutos.' }
});
app.use('/api/auth/login', authLimiter);

// 4. MIDDLEWARES DE PARSEO (Límite ajustado a 10MB)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 5. INICIALIZACIÓN SEGURA DE ADMINISTRADOR
const initAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'cosmetics.beauty.ambar@gmail.com';
    const rawPassword = process.env.ADMIN_PASSWORD;

    if (!rawPassword) {
      console.warn('⚠️ ADVERTENCIA: ADMIN_PASSWORD no está definida en el archivo .env');
      return;
    }

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(rawPassword, 10);
      await User.create({
        name: 'Dueña Ámbar Cosmetics',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        isAdmin: true
      });
      console.log('👑 ¡Cuenta de la Dueña creada y encriptada con éxito!');
    } else {
      const isSamePassword = await bcrypt.compare(rawPassword, existingAdmin.password);
      if (!isSamePassword) {
        existingAdmin.password = await bcrypt.hash(rawPassword, 10);
      }
      existingAdmin.role = 'admin';
      existingAdmin.isAdmin = true;
      await existingAdmin.save();
      console.log('🔄 ¡Cuenta de Admin re-sincronizada de forma segura!');
    }
  } catch (error) {
    console.error('Error al inicializar cuenta admin:', error.message);
  }
};

// 6. CONEXIÓN A MONGO DB ATLAS
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conexión exitosa a MongoDB Atlas 🍃');
    initAdmin();
  })
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// 7. RUTAS PRINCIPALES
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orders'));

app.get('/', (req, res) => {
    res.send('El servidor de Ámbar Cosmetics está funcionando correctamente 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});