const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Obtener token de los encabezados
      token = req.headers.authorization.split(' ')[1];

      if (!process.env.JWT_SECRET) {
        console.error("❌ ERROR CRÍTICO: JWT_SECRET no definida en el archivo .env");
        return res.status(500).json({ message: 'Error de configuración en el servidor' });
      }

      // 2. Verificar Token con la variable de entorno obligatoria
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Extraer ID del usuario
      const userId = decoded.id || decoded._id;
      
      if (!userId) {
        console.error("❌ El token no contiene un ID de usuario válido.");
        return res.status(401).json({ message: 'No autorizado, token inválido' });
      }

      // 4. Buscar usuario excluyendo la contraseña
      req.user = await User.findById(userId).select('-password');

      if (!req.user) {
        console.error("❌ Usuario no encontrado en la BD con ID:", userId);
        return res.status(401).json({ message: 'No autorizado, usuario inexistente' });
      }

      return next();
    } catch (error) {
      console.error("❌ Error en verificación de JWT:", error.message);
      return res.status(401).json({ message: 'No autorizado, token falló o expiró' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'No autorizado, falta el token de autenticación' });
  }
};

const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.isAdmin === true)) {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado: Se requieren permisos de Administrador' });
  }
};

module.exports = { protect, admin };