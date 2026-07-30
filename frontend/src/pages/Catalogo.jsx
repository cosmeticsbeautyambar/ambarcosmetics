import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../context/CartContext';

const getCleanApiUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'https://ambarcosmetics-api.onrender.com/api';
  if ((url.match(/https?:\/\//g) || []).length > 1) {
    const parts = url.split(/(?=https?:\/\/)/);
    url = parts[parts.length - 1];
  }
  url = url.replace(/[\[\]\(\)'"]/g, '').trim().replace(/\/+$/, '');
  if (!url.endsWith('/api')) url += '/api';
  return url;
};

const API_URL = getCleanApiUrl();

// Componente para renderizado de imagen seguro
const SafeImage = ({ src, alt, className = "" }) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`bg-stone-100 flex flex-col items-center justify-center text-stone-400 text-[10px] select-none rounded border border-stone-200 ${className}`}>
        <span>🖼️</span>
        <span>Sin foto</span>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden bg-stone-100 rounded border border-stone-200/80 flex items-center justify-center ${className}`}>
      <img
        src={src}
        alt={alt}
        onError={() => setError(true)}
        className="w-full h-full object-cover object-center transition-transform hover:scale-105 duration-300"
        loading="lazy"
      />
    </div>
  );
};

export default function Catalogo() {
  const { addToCart } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [saleMode, setSaleMode] = useState('minorista'); // 'minorista' | 'mayorista'

  // Cargar lista de productos desde el Backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Error al cargar productos del catálogo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Función para agregar al carrito vía CartContext
  const handleAddToCart = (product) => {
    const isWholesale = saleMode === 'mayorista';
    const currentPrice = isWholesale
      ? (product.priceWholesale || product.priceRetail || product.price)
      : (product.priceRetail || product.price);

    const qtyToAdd = isWholesale ? Number(product.minWholesaleQty || 1) : 1;

    if (product.stock < qtyToAdd) {
      alert(`⚠️ Solo quedan ${product.stock} unidades disponibles.`);
      return;
    }

    const productToCart = {
      ...product,
      price: Number(currentPrice || 0),
      priceRetail: Number(product.priceRetail || product.price || 0),
      priceWholesale: Number(product.priceWholesale || 0)
    };

    addToCart(productToCart, qtyToAdd);
    alert(`🛒 ¡"${product.name}" agregado al carrito! (${qtyToAdd} u.)`);
  };

  // Filtrado dinámico
  const filteredProducts = products.filter((item) => {
    const matchesCategory =
      categoryFilter === 'Todas' ||
      (item.category && item.category.toLowerCase() === categoryFilter.toLowerCase());

    const matchesSearch =
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 font-sans">
      
      {/* CABECERA */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-rose-500">
          Nuestra Colección
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 uppercase tracking-wider">
          Catálogo de Productos
        </h1>
        <p className="text-xs text-stone-500 leading-relaxed">
          Cosmética consciente con formulaciones botánicas de alta calidad.
        </p>

        {/* SELECTOR MODO COMPRA (MINORISTA / MAYORISTA) */}
        <div className="inline-flex p-1 bg-stone-100 rounded-xl border border-stone-200 mt-4">
          <button
            onClick={() => setSaleMode('minorista')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              saleMode === 'minorista'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            🛍️ Venta Minorista
          </button>
          <button
            onClick={() => setSaleMode('mayorista')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              saleMode === 'mayorista'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            📦 Venta Mayorista
          </button>
        </div>
      </div>

      {/* FILTROS Y BÚSQUEDA */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8 bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
        
        <div className="w-full sm:w-72 relative">
          <input
            type="text"
            placeholder="Buscar cosmético..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
          />
          <span className="absolute left-2.5 top-2.5 text-xs text-stone-400">🔍</span>
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-center">
          {['Todas', 'Facial', 'Corporal', 'Capilar'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                categoryFilter === cat
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* LISTADO DE PRODUCTOS */}
      {loading ? (
        <div className="text-center py-20 text-stone-400 text-xs italic space-y-2">
          <span className="text-2xl block animate-spin">✨</span>
          <p>Cargando nuestro catálogo...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-stone-200 shadow-xs">
          <span className="text-4xl">🍃</span>
          <p className="text-xs text-stone-500 mt-2">
            No encontramos productos que coincidan con tu búsqueda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((item) => {
            const isWholesale = saleMode === 'mayorista';
            const price = isWholesale
              ? (item.priceWholesale || item.priceRetail || item.price || 0)
              : (item.priceRetail || item.price || 0);

            const minQty = isWholesale ? (item.minWholesaleQty || 1) : 1;
            const inStock = item.stock >= minQty;

            return (
              <div
                key={item._id}
                className="bg-white rounded-xl border border-stone-200 shadow-xs hover:shadow-md transition flex flex-col overflow-hidden group"
              >
                <div className="relative aspect-square w-full bg-stone-50 p-4 border-b border-stone-100">
                  <SafeImage src={item.image} alt={item.name} className="w-full h-full" />
                  
                  {item.destacado && (
                    <span className="absolute top-3 left-3 bg-rose-500 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
                      ★ Destacado
                    </span>
                  )}

                  {isWholesale && (
                    <span className="absolute top-3 right-3 bg-amber-100 text-amber-800 text-[9px] font-extrabold px-2 py-0.5 rounded border border-amber-200">
                      Min: {minQty} u.
                    </span>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-semibold uppercase text-stone-400 tracking-wider">
                      {item.category || 'General'}
                    </span>
                    <h3 className="font-bold text-xs text-stone-800 line-clamp-1 mt-0.5">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                      {item.description || 'Sin descripción disponible.'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-extrabold text-stone-900">
                        ${Number(price).toLocaleString('es-AR')}
                        {isWholesale && <span className="text-[9px] text-amber-700 block font-normal">Precio Mayorista</span>}
                      </p>
                      <span className={`text-[9px] font-semibold ${inStock ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {inStock ? `Stock: ${item.stock} u.` : 'Sin Stock'}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={!inStock}
                      className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                        inStock
                          ? 'bg-stone-900 text-white hover:bg-stone-800 shadow-xs active:scale-95'
                          : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      }`}
                    >
                      {inStock ? (isWholesale ? `+${minQty} u.` : '🛒 Agregar') : 'Sin Stock'}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}