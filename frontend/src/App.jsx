import React, { useState } from 'react';

// Contexto Global de Productos y Stock
import { ProductProvider } from './context/ProductContext';

// Páginas y Componentes
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  // Estado para cambiar de vista en la aplicación ('home', 'catalogo', 'admin')
  const [currentView, setCurrentView] = useState('home');

  return (
    <ProductProvider>
      {/* BARRA DE NAVEGACIÓN SUPERIOR DE CONTROL */}
      <nav className="bg-stone-900 text-stone-300 py-2.5 px-4 text-xs font-semibold uppercase tracking-[0.15em] border-b border-stone-800 sticky top-0 z-[100] flex justify-between items-center shadow-md">
        
        {/* LOGO O MARCA RÁPIDA */}
        <div 
          onClick={() => setCurrentView('home')} 
          className="cursor-pointer text-white hover:text-rose-200 transition flex items-center gap-1.5 font-bold"
        >
          <span>✨</span>
          <span>Ámbar Cosmetics</span>
        </div>

        {/* SELECTOR DE PANTALLAS */}
        <div className="flex items-center space-x-3 sm:space-x-6 text-[10px] sm:text-xs">
          <button
            onClick={() => setCurrentView('home')}
            className={`transition pb-0.5 ${
              currentView === 'home'
                ? 'text-white border-b-2 border-white font-bold'
                : 'hover:text-white'
            }`}
          >
            Inicio
          </button>

          <button
            onClick={() => setCurrentView('catalogo')}
            className={`transition pb-0.5 ${
              currentView === 'catalogo'
                ? 'text-white border-b-2 border-white font-bold'
                : 'hover:text-white'
            }`}
          >
            Catálogo
          </button>

          <button
            onClick={() => setCurrentView('admin')}
            className={`transition pb-0.5 px-2.5 py-1 rounded-xs border ${
              currentView === 'admin'
                ? 'bg-rose-200 text-stone-900 border-rose-200 font-bold'
                : 'border-stone-700 text-stone-300 hover:border-stone-500 hover:text-white'
            }`}
          >
            🔐 Panel Dueña
          </button>
        </div>

      </nav>

      {/* RENDERIZADO DINÁMICO DE PANTALLAS */}
      <main className="min-h-screen bg-stone-50">
        {currentView === 'home' && <Home />}
        {currentView === 'catalogo' && <Catalogo />}
        {currentView === 'admin' && <AdminPanel />}
      </main>
    </ProductProvider>
  );
}