import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

// 📱 NÚMERO DE WHATSAPP DE LA DUEÑA (Sin el signo + ni espacios)
const WHATSAPP_NUMBER = '5491112345678'; // 👈 Reemplazá este número por el real

// 🌟 CARGA AUTOMÁTICA DE IMÁGENES DE LA CARPETA ASSETS/RESEÑAS
const reviewModules = import.meta.glob('../assets/reseñas/*.{png,jpg,jpeg,webp,PNG,JPG,WEBP}', {
  eager: true,
  import: 'default'
});
const reviewImages = Object.values(reviewModules);

const getCleanApiUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'https://ambarcosmetics-api.onrender.com/api';
  if ((url.match(/https?:\/\//g) || []).length > 1) {
    const parts = url.split(/(?=https?:\/\/)/);
    url = parts[parts.length - 1];
  }
  return url.replace(/[\[\]\(\)'"]/g, '').trim().replace(/\/+$/, '').concat(url.endsWith('/api') ? '' : '/api');
};

const API_URL = getCleanApiUrl();

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

  // Estados del Proceso de Compra
  const [step, setStep] = useState('cart'); // 'cart' | 'checkout'
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  // Datos para Facturación y Envío
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dni: '',
    taxType: 'Consumidor Final',
    address: '',
    city: '',
    notes: ''
  });

  // Rotación Automática de Reseñas de WhatsApp
  useEffect(() => {
    if (reviewImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % reviewImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextReview = () => {
    if (reviewImages.length > 0) {
      setCurrentReviewIndex((prev) => (prev + 1) % reviewImages.length);
    }
  };

  const handlePrevReview = () => {
    if (reviewImages.length > 0) {
      setCurrentReviewIndex((prev) => (prev - 1 + reviewImages.length) % reviewImages.length);
    }
  };

  // 🚀 PROCESAR PEDIDO: DESCONTAR STOCK Y ENVIAR POR WHATSAPP
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const orderPayload = {
      customer: formData,
      items: cartItems.map((item) => ({
        _id: item._id,
        name: item.name,
        qty: item.qty,
        price: item.price || item.priceRetail || 0
      })),
      subtotal: cartSubtotal,
      discount: cartDiscount,
      total: cartTotal
    };

    try {
      // 1. Envía la orden a /api/orders para restar el stock en MongoDB
      await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
    } catch (error) {
      console.warn("No se pudo conectar con el servidor para restar el stock, procesando pedido por WhatsApp de todos modos:", error);
    } finally {
      // 2. Construir mensaje personalizado para WhatsApp
      let message = `*✨ NUEVO PEDIDO - ÁMBAR COSMETICS ✨*\n\n`;
      message += `*👤 Cliente:* ${formData.fullName}\n`;
      message += `*📱 Teléfono:* ${formData.phone}\n`;
      message += `*📧 Email:* ${formData.email}\n`;
      message += `*📄 DNI/CUIT:* ${formData.dni} (${formData.taxType})\n`;
      message += `*📍 Dirección:* ${formData.address}\n`;
      if (formData.notes) message += `*📝 Notas:* ${formData.notes}\n`;
      
      message += `\n*🛍️ DETALLE DE PRODUCTOS:*\n`;
      cartItems.forEach((item) => {
        const price = item.price || item.priceRetail || 0;
        message += `• ${item.name} x${item.qty} - $${(price * item.qty).toLocaleString('es-AR')}\n`;
      });

      message += `\n*Subtotal:* $${cartSubtotal.toLocaleString('es-AR')}\n`;
      if (aplicaDescuento) {
        message += `*Descuento 10% OFF:* -$${cartDiscount.toLocaleString('es-AR')}\n`;
      }
      message += `*💰 TOTAL A PAGAR:* $${cartTotal.toLocaleString('es-AR')}\n\n`;
      message += `_¡Hola! Quisiera los datos bancarios para abonar la compra y confirmar el envío. ¡Muchas gracias!_`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

      // 3. Limpiar carrito, abrir WhatsApp y volver al inicio
      clearCart();
      setIsProcessing(false);
      window.open(whatsappUrl, '_blank');
      navigate('/');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 font-sans">
      
      {/* CABECERA Y NAVEGACIÓN DE PASOS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 mb-6 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-widest text-stone-900 flex items-center gap-2">
            <span>🛍️</span> {step === 'cart' ? 'Tu Carrito de Compras' : 'Finalizar Pedido'}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            {step === 'cart' ? 'Revisá tus productos antes de confirmar' : 'Ingresá tus datos de envío para coordinar el pedido'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {step === 'checkout' && (
            <button
              onClick={() => setStep('cart')}
              className="text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-2 rounded-lg transition flex items-center gap-1"
            >
              ← Volver al Carrito
            </button>
          )}
          <button
            onClick={() => navigate('/catalogo')}
            className="text-xs font-semibold text-stone-600 hover:text-stone-900 transition flex items-center gap-1"
          >
            Ver más productos
          </button>
        </div>
      </div>

      {cartItems.length === 0 ? (
        /* CARRITO VACÍO */
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* COLUMNA PRINCIPAL (ITEMS O CHECKOUT) */}
          <div className="lg:col-span-7 space-y-6">
            
            {step === 'cart' ? (
              /* PASO 1: LISTA DE PRODUCTOS */
              <div className="space-y-3">
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
                        className="w-16 h-16 object-cover bg-stone-50 rounded-lg border border-stone-100 shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-stone-800 truncate">{item.name}</h4>
                        <p className="text-xs text-stone-500 mt-0.5">
                          ${price.toLocaleString('es-AR')} u.
                        </p>

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
            ) : (
              /* PASO 2: FORMULARIO DE FACTURACIÓN Y ENVÍO */
              <form id="checkout-form" onSubmit={handlePaymentSubmit} className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4 text-xs">
                <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
                  <h3 className="font-bold text-stone-800 text-sm flex items-center gap-2">
                    📋 Datos de Facturación y Envío
                  </h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    Directo a WhatsApp
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-stone-700 mb-1">Nombre y Apellido Completo *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="Ej: María Laura Giménez"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="ejemplo@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Teléfono / WhatsApp *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="Ej: 1123456789"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">DNI / CUIT *</label>
                    <input
                      type="text"
                      name="dni"
                      required
                      placeholder="12345678"
                      value={formData.dni}
                      onChange={handleInputChange}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Condición Fiscal *</label>
                    <select
                      name="taxType"
                      value={formData.taxType}
                      onChange={handleInputChange}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                    >
                      <option value="Consumidor Final">Consumidor Final</option>
                      <option value="Monotributo">Monotributo</option>
                      <option value="Responsable Inscripto">Responsable Inscripto</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-stone-700 mb-1">Dirección de Entrega / Entrecalle *</label>
                    <input
                      type="text"
                      name="address"
                      required
                      placeholder="Calle 123, Piso 2 B"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-stone-700 mb-1">Aclaraciones o Notas para el pedido</label>
                    <textarea
                      name="notes"
                      rows="2"
                      placeholder="Horario preferido de entrega, código de timbre, etc."
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                    />
                  </div>
                </div>
              </form>
            )}

            {/* 💬 BANNER / LAYER DE RESEÑAS REALES DE WHATSAPP */}
            <div className="bg-emerald-950 text-white p-5 rounded-2xl shadow-lg border border-emerald-800/50 space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-center border-b border-emerald-800/60 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💬</span>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-100 uppercase tracking-wide">
                      Experiencias Reales de Clientes
                    </h4>
                    <p className="text-[10px] text-emerald-300">
                      Resultados comprobados por nuestra comunidad en WhatsApp
                    </p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-800/80 text-emerald-200 font-bold px-2 py-0.5 rounded-full">
                  ⭐ +500 Reseñas
                </span>
              </div>

              {reviewImages.length > 0 ? (
                <div className="relative group flex items-center justify-center bg-black/30 rounded-xl p-2 border border-emerald-800/40">
                  <img
                    src={reviewImages[currentReviewIndex]}
                    alt={`Reseña WhatsApp ${currentReviewIndex + 1}`}
                    className="max-h-64 object-contain rounded-lg transition-all duration-300 shadow-md"
                  />

                  {/* Botones Manuales de Galería */}
                  {reviewImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrevReview}
                        className="absolute left-2 bg-stone-900/80 hover:bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-md transition"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        onClick={handleNextReview}
                        className="absolute right-2 bg-stone-900/80 hover:bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-md transition"
                      >
                        ›
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-emerald-900/40 rounded-xl text-center text-xs text-emerald-200 border border-emerald-800/50">
                  <p>💬 "¡Excelente calidad! Mi piel cambió completamente desde el primer uso."</p>
                  <span className="block text-[10px] text-emerald-400 mt-1 font-semibold">— Mensaje verificado de WhatsApp</span>
                </div>
              )}

              <div className="flex justify-center items-center gap-1.5 pt-1">
                {reviewImages.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentReviewIndex ? 'w-5 bg-emerald-400' : 'w-1.5 bg-emerald-800'
                    }`}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* COLUMNA DERECHA: RESUMEN DE PAGOS Y ENVIAR */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm sticky top-6 space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 border-b border-stone-100 pb-3 flex items-center justify-between">
                <span>Resumen de Compra</span>
                <span className="text-[10px] text-stone-400 font-normal">({cartItems.length} prod.)</span>
              </h3>

              <div className="space-y-2.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${cartSubtotal.toLocaleString('es-AR')}</span>
                </div>

                {aplicaDescuento ? (
                  <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                    <span>✨ Descuento 10% OFF PROMO:</span>
                    <span>-${cartDiscount.toLocaleString('es-AR')}</span>
                  </div>
                ) : (
                  <p className="text-[10px] text-stone-500 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/80 italic">
                    💡 Sumá ${(50000 - cartSubtotal).toLocaleString('es-AR')} más para obtener **10% OFF**.
                  </p>
                )}

                <div className="flex justify-between text-sm font-extrabold text-stone-900 pt-3 border-t border-stone-100">
                  <span>Total Final:</span>
                  <span className="text-base text-stone-900">${cartTotal.toLocaleString('es-AR')}</span>
                </div>
              </div>

              {/* BOTONES DE ACCIÓN */}
              {step === 'cart' ? (
                <button
                  onClick={() => setStep('checkout')}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-3 text-xs uppercase tracking-wider rounded-lg transition shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Cargar Datos de Envío</span>
                  <span>→</span>
                </button>
              ) : (
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isProcessing}
                  className={`w-full py-3.5 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition shadow-md flex items-center justify-center gap-2 ${
                    isProcessing
                      ? 'bg-stone-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99]'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      <span>Registrando Pedido...</span>
                    </>
                  ) : (
                    <>
                      <span>📱 Enviar Pedido por WhatsApp</span>
                    </>
                  )}
                </button>
              )}

              {/* BADGES DE SEGURIDAD Y MEDIOS DE PAGO */}
              <div className="pt-2 border-t border-stone-100 space-y-2 text-center">
                <div className="flex items-center justify-center gap-3 text-stone-400 text-lg">
                  <span title="WhatsApp Directo">📱</span>
                  <span title="Transferencia Bancaria">🏦</span>
                  <span title="Atención Personalizada">🤝</span>
                </div>
                <p className="text-[10px] text-stone-400 font-medium">
                  Al hacer clic se enviará el pedido al WhatsApp oficial de la tienda.
                </p>
              </div>

            </div>
          </div>

        </div>
      )}
    </div>
  );
}