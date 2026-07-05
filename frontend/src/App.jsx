import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import Carrito from './pages/Carrito';
import Logistica from './pages/Logistica';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {/* El Navbar se mantiene fijo arriba en todas las páginas */}
        <Navbar /> 
        
        {/* Contenedor de las páginas */}
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/admin" element={<Logistica />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;