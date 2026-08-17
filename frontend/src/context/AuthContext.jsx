import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

// Limpieza profunda de la URL de la API y anti-duplicación
const getCleanApiUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'https://ambarcosmetics-api.onrender.com/api';

  if ((url.match(/https?:\/\//g) || []).length > 1) {
    const parts = url.split(/(?=https?:\/\/)/);
    url = parts[parts.length - 1];
  }

  url = url.replace(/[\[\]\(\)'"]/g, '').trim().replace(/\/+$/, '');

  if (!url.endsWith('/api')) {
    url += '/api';
  }

  return url;
};

const API_URL = getCleanApiUrl();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('userInfo');
      return saved ? JSON.parse(saved) : null;
    } catch (err) {
      console.error('Error al parsear el usuario del localStorage:', err);
      localStorage.removeItem('userInfo');
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // Limpieza automática si el token o estructura almacenada son inválidos
  useEffect(() => {
    if (user && !user.token) {
      logout();
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      let res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });

      if (res.status === 404) {
        res = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), password })
        });
      }

      const contentType = res.headers.get('content-type');
      let data = {};
      
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      }

      if (!res.ok) {
        throw new Error(data.message || `Error en el servidor (${res.status})`);
      }

      if (!data.token) {
        throw new Error('Respuesta del servidor inválida: falta token de acceso');
      }

      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      console.error('Error en Login:', error);
      return { 
        success: false, 
        message: error.message || 'No se pudo conectar con el servidor. Verificá tu conexión a internet.' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};