require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

// CREDENCIALES DEL ADMINISTRADOR
const adminEmail = 'cosmetics.beauty.ambar@gmail.com';
const adminPassword = 'ambar123456';

const runSeed = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error('No se encontró MONGO_URI en las variables de entorno');

    console.log('🍃 Conectando a MongoDB Atlas...');
    await mongoose.connect(mongoUri);

    const cleanEmail = adminEmail.trim().toLowerCase();

    console.log(`🧹 Eliminando registros previos con email: ${cleanEmail}`);
    await User.deleteMany({ email: cleanEmail });

    // Se pasa la contraseña en texto plano.
    // El hook pre('save') de tu modelo User.js la encriptará automáticamente con bcrypt.
    const newAdmin = await User.create({
      name: 'Dueña Ámbar Cosmetics',
      email: cleanEmail,
      password: adminPassword,
      role: 'admin',
      isAdmin: true
    });

    console.log('==================================================');
    console.log('👑 ¡USUARIO ADMIN CREADO Y ENCRIPTADO CORRECTAMENTE!');
    console.log(`📌 ID: ${newAdmin._id}`);
    console.log(`📧 Email: ${cleanEmail}`);
    console.log(`🔑 Contraseña: ${adminPassword}`);
    console.log('==================================================');

  } catch (error) {
    console.error('❌ Error al ejecutar el script:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Conexión a MongoDB cerrada.');
    process.exit(0);
  }
};

runSeed();