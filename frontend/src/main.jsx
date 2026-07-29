import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Importamos los contextos con el orden correcto
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './components/ProductContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* AuthProvider envuelve a ProductProvider para dar soporte a la autenticación */}
    <AuthProvider>
      <ProductProvider>
        <App />
      </ProductProvider>
    </AuthProvider>
  </React.StrictMode>
);