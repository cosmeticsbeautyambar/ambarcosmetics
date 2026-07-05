import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 p-4 flex flex-col justify-between hover:shadow-lg transition">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-4" />
      <div>
        <span className="text-xs font-semibold text-pink-500 uppercase tracking-wider">{product.category}</span>
        <h3 className="text-lg font-bold text-gray-800 mt-1">{product.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{product.description}</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xl font-extrabold text-gray-900">${product.price}</span>
        <button 
          onClick={() => addToCart(product)}
          className="bg-pink-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-pink-700 transition"
        >
          Agregar 🛒
        </button>
      </div>
    </div>
  );
}