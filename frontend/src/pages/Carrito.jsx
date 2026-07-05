import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export default function Carrito() {
  const { cartItems, removeFromCart, cartTotal, clearCart } = useContext(CartContext);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Tu Carrito de Compras</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-center py-10">El carrito está vacío. ¡Visitá el catálogo! 💄</p>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          {cartItems.map(item => (
            <div key={item._id} className="flex justify-between items-center border-b border-gray-100 py-4">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                <div>
                  <h4 className="font-bold text-gray-800">{item.name}</h4>
                  <p className="text-sm text-gray-500">Cantidad: {item.qty} x ${item.price}</p>
                </div>
              </div>
              <button 
                onClick={() => removeFromCart(item._id)}
                className="text-red-500 font-medium hover:underline text-sm"
              >
                Eliminar
              </button>
            </div>
          ))}
          <div className="mt-6 flex justify-between items-center">
            <span className="text-xl font-bold text-gray-800">Total:</span>
            <span className="text-2xl font-extrabold text-pink-600">${cartTotal}</span>
          </div>
          <div className="mt-8 flex gap-4 justify-end">
            <button onClick={clearCart} className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"> Vaciar </button>
            <button onClick={() => alert('¡Pedido Simulado! Próximamente pasarela de pago.')} className="px-6 py-2 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700"> Finalizar Pedido </button>
          </div>
        </div>
      )}
    </div>
  );
}