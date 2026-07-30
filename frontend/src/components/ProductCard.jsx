import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext'; // Ajusta la ruta según la estructura de tu proyecto

export default function ProductCard({ product, saleMode }) {
  const { addToCart } = useContext(CartContext);

  const isWholesale = saleMode === 'mayorista';
  const currentPrice = isWholesale 
    ? (product.priceWholesale || product.priceRetail || product.price) 
    : (product.priceRetail || product.price);
    
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    // Si es mayorista agrega el mínimo configurado, si no, 1 unidad
    const qtyToAdd = isWholesale ? Number(product.minWholesaleQty || 1) : 1;
    
    if (product.stock < qtyToAdd) {
      alert(`⚠️ Solo quedan ${product.stock} unidades disponibles.`);
      return;
    }

    // Enviamos el producto al CartContext real
    const productToCart = {
      ...product,
      price: currentPrice, // Setea el precio activo (Minorista o Mayorista)
      priceRetail: product.priceRetail || product.price,
      priceWholesale: product.priceWholesale
    };

    addToCart(productToCart, qtyToAdd);
    
    alert(`🛒 ¡Agregado al carrito! (${qtyToAdd} u. en modo ${isWholesale ? 'Mayorista' : 'Minorista'})`);
  };

  return (
    <div className="bg-white border border-stone-200 p-4 flex flex-col justify-between relative group hover:shadow-md transition duration-300">
      
      {/* BADGES SUPERIORES */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-1 items-start">
        {isOutOfStock ? (
          <span className="bg-stone-900 text-white text-[8px] font-bold uppercase tracking-widest px-2 py-0.5">
            AGOTADO
          </span>
        ) : (
          <span className="bg-stone-100 text-stone-600 text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 border border-stone-200">
            Stock: {product.stock} u.
          </span>
        )}

        {isWholesale && (
          <span className="bg-rose-100 text-rose-800 text-[8px] font-bold uppercase tracking-widest px-2 py-0.5">
            Mínimo: {product.minWholesaleQty || 1} u.
          </span>
        )}
      </div>

      {/* CONTENEDOR DE FOTO */}
      <div className="w-full aspect-square bg-stone-50 mb-4 overflow-hidden relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition duration-500 ease-out ${
            isOutOfStock ? 'grayscale opacity-60' : ''
          }`}
        />
      </div>

      {/* DETALLES */}
      <div className="space-y-2 flex-grow flex flex-col justify-between">
        <div>
          <span className="text-[9px] font-bold tracking-[0.2em] text-stone-400 uppercase block">
            {product.category}
          </span>
          <h3 className="text-xs font-semibold text-stone-800 uppercase tracking-wider mt-0.5">
            {product.name}
          </h3>
          <p className="text-[11px] text-stone-500 font-light line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* VALOR Y BOTÓN */}
        <div className="pt-3 border-t border-stone-100 space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] font-medium uppercase text-stone-400">
              {isWholesale ? 'Precio Mayorista:' : 'Precio Individual:'}
            </span>
            <span className="text-sm font-bold text-stone-900">
              ${Number(currentPrice || 0).toLocaleString('es-AR')}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-2 text-[10px] font-bold uppercase tracking-[0.15em] transition ${
              isOutOfStock 
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
                : 'bg-stone-900 text-white hover:bg-stone-800'
            }`}
          >
            {isOutOfStock ? 'Sin Stock' : isWholesale ? `Agregar (${product.minWholesaleQty || 1} u.)` : 'Agregar al Carrito'}
          </button>
        </div>
      </div>

    </div>
  );
}