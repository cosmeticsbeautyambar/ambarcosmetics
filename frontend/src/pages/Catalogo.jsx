import React, { useState, useContext } from 'react';
import { ProductContext } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';

export default function Catalogo() {
  const { products } = useContext(ProductContext);

  // MODO DE COMPRA: 'minorista' | 'mayorista'
  const [saleMode, setSaleMode] = useState('minorista');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  // Filtrado de productos por búsqueda y categoría
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 max-w-6xl mx-auto font-sans text-stone-800">
      
      {/* 1. SELECTOR INTERACTIVO VENTA MINORISTA / MAYORISTA */}
      <div className="bg-white border border-stone-200 p-4 mb-8 shadow-xs rounded-xs text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400 mb-3">
          Modalidad de Compra
        </p>

        <div className="inline-flex p-1 bg-stone-100 rounded-none border border-stone-200">
          <button
            onClick={() => setSaleMode('minorista')}
            className={`px-5 py-2 text-[11px] font-bold uppercase tracking-[0.15em] transition ${
              saleMode === 'minorista'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            🛒 Venta Minorista
          </button>
          
          <button
            onClick={() => setSaleMode('mayorista')}
            className={`px-5 py-2 text-[11px] font-bold uppercase tracking-[0.15em] transition ${
              saleMode === 'mayorista'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            📦 Venta Mayorista
          </button>
        </div>

        {/* NOTA ACLARATORIA SEGÚN EL MODO SELECCIONADO */}
        <div className="mt-3 text-xs font-light text-stone-600">
          {saleMode === 'minorista' ? (
            <p>Comprá desde 1 unidad con despacho a todo el país.</p>
          ) : (
            <p className="text-rose-700 font-normal">
              🔥 <strong>Modo Mayorista Activado:</strong> Precios diferenciados para revendedoras aplicando las cantidades mínimas indicadas por producto.
            </p>
          )}
        </div>
      </div>

      {/* 2. FILTROS Y BUSCADOR */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 border-b border-stone-200 pb-5">
        
        {/* BUSCADOR */}
        <div className="w-full md:w-80 relative">
          <input 
            type="text"
            placeholder="Buscar por nombre o extracto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-3 pr-8 py-2 border border-stone-300 bg-white text-xs text-stone-700 focus:outline-none focus:border-stone-800"
          />
          <span className="absolute right-2.5 top-2.5 text-xs text-stone-400">🔍</span>
        </div>

        {/* CATEGORÍAS */}
        <div className="flex flex-wrap gap-2 justify-center">
          {['Todas', 'Faciales', 'Corporales', 'Capilares'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] border transition ${
                selectedCategory === cat
                  ? 'border-stone-900 bg-stone-900 text-white'
                  : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* 3. GRILLA DE PRODUCTOS DINÁMICA */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white border border-stone-200">
          <p className="text-xs text-stone-500 uppercase tracking-widest">
            No se encontraron productos en esta categoría o búsqueda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              saleMode={saleMode} 
            />
          ))}
        </div>
      )}

    </div>
  );
}