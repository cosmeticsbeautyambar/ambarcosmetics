import React, { useState, useEffect } from 'react'; // 1. Agregamos hooks

export default function Home() {
  const [destacados, setDestacados] = useState([]); // 2. Estado para productos reales

  // 3. Efecto para llamar a tu nueva ruta /api/productos/destacados
  useEffect(() => {
    fetch('/api/productos/destacados')
      .then((res) => res.json())
      .then((data) => setDestacados(data))
      .catch((err) => console.error("Error cargando destacados:", err));
  }, []);

  // ... (mantené la constante 'lanzamientos' igual que antes)

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans antialiased">
      {/* ... (Header y Hero Banner iguales) ... */}

      {/* 5. DESTACADOS DINÁMICOS */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-center text-stone-400 mb-12">Lo más elegido</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {destacados.map((item) => (
            <div key={item._id} className="bg-white border border-stone-200 p-6 rounded-xs relative flex flex-col justify-between shadow-xs hover:border-stone-300 transition duration-300">
              {/* Imagen dinámica desde MongoDB */}
              <div className="h-44 w-full bg-stone-50 rounded-xs mb-5 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-[11px] font-medium tracking-wider text-stone-600 uppercase">{item.name}</h3>
                <p className="text-xs font-semibold text-stone-900 pb-2">${item.price.toLocaleString('es-AR')}</p>
                <button className="w-full bg-stone-900 text-white py-2.5 text-[10px] font-medium uppercase tracking-[0.15em] hover:bg-stone-800 transition rounded-none">
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ... (Resto del Footer igual) ... */}
    </div>
  );
}