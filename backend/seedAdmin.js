require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const adminEmail = 'cosmetics.beauty.ambar@gmail.com';
const adminPassword = 'ambar123456';

const runSeed = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('No se encontró MONGO_URI en las variables de entorno (.env)');
    }

    console.log('🍃 Conectando a MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado con éxito.');

    // 1. Borramos cualquier usuario con este email
    console.log(`🧹 Limpiando registros previos de: ${adminEmail}...`);
    await User.deleteMany({ email: adminEmail });

    // 2. Generamos el hash encriptado de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // 3. Insertamos directo omitiendo hooks middleware (evita el error 'next is not a function')
    const [newAdmin] = await User.insertMany([
      {
        name: 'Dueña Ámbar Cosmetics',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        isAdmin: true
      }
    ]);

    console.log('==================================================');
    console.log('👑 ¡USUARIO ADMIN CREADO Y FIJADO CON ÉXITO!');
    console.log(`📌 ID: ${newAdmin._id}`);
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Contraseña: ${adminPassword}`);
    console.log('==================================================');

  } catch (error) {
    console.error('❌ Error al ejecutar el script de Admin:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Conexión con MongoDB cerrada.');
    process.exit(0);
  }
};

runSeed();