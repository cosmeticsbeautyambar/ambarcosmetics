import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

export default function Carrito() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    aplicaDescuento
  } = useContext(CartContext);

  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 font-sans">
      <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-widest text-stone-900 flex items-center gap-2">
          <span>🛍️</span> Tu Carrito de Compras
        </h2>
        <button
          onClick={() => navigate('/catalogo')}
          className="text-xs font-semibold text-stone-600 hover:text-stone-900 transition flex items-center gap-1"
        >
          ← Volver al Catálogo
        </button>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-stone-200 shadow-xs space-y-4">
          <span className="text-5xl">💄</span>
          <h3 className="text-base font-bold text-stone-800">El carrito está vacío</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Explorá nuestro catálogo y elegí tus cosméticos conscientes favoritos.
          </p>
          <button
            onClick={() => navigate('/catalogo')}
            className="inline-block bg-stone-900 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg hover:bg-stone-800 transition"
          >
            Ver Catálogo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LISTA DE PRODUCTOS */}
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((item) => {
              const price = item.price || item.priceRetail || 0;
              return (
                <div
                  key={item._id}
                  className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex gap-4 items-center"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain bg-stone-50 rounded-lg border border-stone-100 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-stone-800 truncate">{item.name}</h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      ${price.toLocaleString('es-AR')} u.
                    </p>

                    {/* SELECTOR DE CANTIDAD */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-stone-300 rounded-md overflow-hidden bg-stone-50">
                        <button
                          onClick={() => updateQuantity(item._id, -1)}
                          className="px-2 py-0.5 hover:bg-stone-200 text-stone-700 font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="px-2.5 text-xs font-bold text-stone-800">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, 1)}
                          className="px-2 py-0.5 hover:bg-stone-200 text-stone-700 font-bold text-xs"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-[11px] text-rose-600 hover:text-rose-800 transition font-medium"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-stone-900">
                      ${(price * item.qty).toLocaleString('es-AR')}
                    </p>
                  </div>
                </div>
              );
            })}

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={clearCart}
                className="text-xs font-semibold text-stone-500 hover:text-rose-600 transition"
              >
                🗑️ Vaciar todo el carrito
              </button>
            </div>
          </div>

          {/* RESUMEN DE PAGOS */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm h-fit space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 border-b border-stone-100 pb-3">
              Resumen de Compra
            </h3>

            <div className="space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold">${cartSubtotal.toLocaleString('es-AR')}</span>
              </div>

              {aplicaDescuento ? (
                <div className="flex justify-between text-emerald-600 font-semibold bg-emerald-50 p-2 rounded border border-emerald-200">
                  <span>✨ Descuento 10% OFF PROMO:</span>
                  <span>-${cartDiscount.toLocaleString('es-AR')}</span>
                </div>
              ) : (
                <p className="text-[10px] text-stone-400 bg-stone-50 p-2 rounded border border-stone-200 italic">
                  💡 Sumá ${(50000 - cartSubtotal).toLocaleString('es-AR')} más para obtener **10% OFF**.
                </p>
              )}

              <div className="flex justify-between text-sm font-extrabold text-stone-900 pt-3 border-t border-stone-100">
                <span>Total:</span>
                <span className="text-base text-stone-900">${cartTotal.toLocaleString('es-AR')}</span>
              </div>
            </div>

            <button
              onClick={() => alert('¡Pedido Simulado! Próximamente pasarela de pago.')}
              className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-3 text-xs uppercase tracking-wider rounded-lg transition shadow-xs"
            >
              Finalizar Pedido
            </button>
          </div>

        </div>
      )}
    </div>
  );
}