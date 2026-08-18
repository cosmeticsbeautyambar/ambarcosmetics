const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET no configurado en las variables de entorno');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Registro de usuarios clientes
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const cleanEmail = email.trim().toLowerCase();
    
    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) return res.status(400).json({ message: 'El usuario ya existe' });

    const user = await User.create({ 
      name: name.trim(), 
      email: cleanEmail, 
      password, 
      role: 'user',
      isAdmin: false
    });
    
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Error en registerUser:', error);
    res.status(500).json({ message: 'Error interno al registrar usuario' });
  }
};

// Login general (Dueña y Clientes)
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('--- INTENTO DE LOGIN ---');
    console.log('1. Email recibido del body:', `"${email}"`);
    console.log('2. Password recibida del body:', `"${password}"`);

    if (!email || !password) {
      return res.status(400).json({ message: 'Por favor ingresá email y contraseña' });
    }

    const cleanEmail = email.trim().toLowerCase();
    console.log('3. Email limpio para la búsqueda:', `"${cleanEmail}"`);

    // Traemos el campo password explícitamente
    const user = await User.findOne({ email: cleanEmail }).select('+password');

    if (!user) {
      console.log('❌ RESULTADO: Usuario no encontrado en la Base de Datos');
      return res.status(401).json({ message: 'Credenciales inválidas. Verificá tu correo y contraseña.' });
    }

    console.log('4. Usuario encontrado en BD con ID:', user._id);
    console.log('5. Hash guardado en BD:', user.password);

    const isMatch = await user.matchPassword(password);
    console.log('6. ¿Coincide la contraseña?:', isMatch);

    if (isMatch) {
      console.log('✅ LOGIN EXITOSO');
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
      });
    } else {
      console.log('❌ RESULTADO: La contraseña no coincide con el hash guardado');
      return res.status(401).json({ message: 'Credenciales inválidas. Verificá tu correo y contraseña.' });
    }
  } catch (error) {
    console.error('❌ Error en loginUser:', error);
    res.status(500).json({ message: 'Error interno en el servidor de autenticación' });
  }
};