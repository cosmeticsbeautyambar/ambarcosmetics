import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';

// Datos de prueba locales
const MOCK_PRODUCTS = [
  { _id: '1', name: 'Labial Matte Velvet', description: 'Color intenso de larga duración.', price: 1200, category: 'Labios', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500' },
  { _id: '2', name: 'Máscara pestañas HD', description: 'Volumen extremo a prueba de agua.', price: 1500, category: 'Ojos', image: 'https://images.unsplash.com/photo-1631214524020-5e18d9765176?w=500' },
  { _id: '3', name: 'Base Fluida Hidratante', description: 'Cobertura media con acabado natural.', price: 2200, category: 'Rostro', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500' },
];

export default function Catalogo() {
  const [search, setSearch] = useState('');

  const filteredProducts = MOCK_PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8 max-w-md mx-auto">
        <input 
          type="text" 
          placeholder="🔍 Buscar cosmético (Ej: Labial...)" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>
      
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Nuestro Catálogo</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}