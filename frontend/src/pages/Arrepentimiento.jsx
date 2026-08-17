import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Arrepentimiento() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    numeroOrden: '',
    motivo: ''
  });
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    document.title = "Boton de Arrepentimiento - Ámbar Cosmetics";
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí podés conectar la lógica para enviar por API o Mail
    setEnviado(true);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans py-10 px-4 sm:px-6 overflow-y-scroll">
      <div className="max-w-2xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-rose-200 shadow-sm space-y-6">
        
        {/* ENCABEZADO */}
        <div className="border-b border-rose-100 pb-4 text-center sm:text-left">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-rose-800 hover:text-stone-900 font-semibold uppercase tracking-wider mb-2 inline-flex items-center gap-1 transition"
          >
            ← Volver al inicio
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 uppercase tracking-wide">
            Botón de Arrepentimiento
          </h1>
          <p className="text-[11px] sm:text-xs text-stone-500 mt-2 leading-relaxed">
            Conforme a la Ley N° 24.240 de Defensa del Consumidor, tenés 10 (diez) días corridos desde recibido el producto para revocar la compra.
          </p>
        </div>

        {enviado ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
            <span className="text-3xl">✨</span>
            <h3 className="text-sm font-bold text-emerald-900">Solicitud Ingresada con Éxito</h3>
            <p className="text-xs text-emerald-700">
              Hemos recibido tu solicitud de revocación. Nos pondremos en contacto a la brevedad para coordinar la devolución.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-2 bg-stone-900 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-stone-800 transition"
            >
              Volver al inicio
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-700 font-bold mb-1">Nombre y Apellido *</label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                placeholder="Juan Pérez"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-700 font-bold mb-1">Email de Contacto *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                  placeholder="usuario@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Teléfono / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                  placeholder="11 1234 5678"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">Número de Orden o Pedido *</label>
              <input
                type="text"
                required
                value={formData.numeroOrden}
                onChange={(e) => setFormData({ ...formData, numeroOrden: e.target.value })}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                placeholder="Ej: #1024"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">Comentarios / Motivo (Opcional)</label>
              <textarea
                rows="3"
                value={formData.motivo}
                onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800 resize-none"
                placeholder="Escribí brevemente la razón de la solicitud..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition active:scale-95 uppercase tracking-wider text-[11px] shadow-sm"
            >
              Enviar Solicitud de Arrepentimiento
            </button>
          </form>
        )}

      </div>
    </div>
  );
}