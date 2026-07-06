import React from 'react';

export default function Home() {
  // Datos simulados estructurados sin imágenes externas
  const lanzamientos = [
    { id: 1, name: 'Línea Rostro', color: 'bg-rose-50' },
    { id: 2, name: 'Skin Care', color: 'bg-orange-50' },
    { id: 3, name: 'Labiales', color: 'bg-red-50' },
  ];

  const destacados = [
    { id: 1, name: 'MÁSCARA PARA PESTAÑAS', price: '$21.000,00', color: 'bg-stone-100' },
    { id: 2, name: 'BASE BB CREAM ÁMBAR', price: '$30.000,00', color: 'bg-stone-100', tag: 'Envío gratis' },
    { id: 3, name: 'CORRECTOR LÍQUIDO', price: '$24.000,00', color: 'bg-stone-100' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 text-stone-800 font-sans antialiased">

      {/* 1. HEADER & NAVBAR */}
      <header className="border-b border-stone-200 sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-semibold tracking-widest text-stone-900">ÁMBAR</div>
          
          {/* Buscador minimalista */}
          <div className="hidden md:flex items-center border border-stone-300 rounded px-3 py-1 w-1/3 bg-stone-50">
            <input type="text" placeholder="Buscar..." className="w-full bg-transparent focus:outline-none text-xs" />
            <span className="text-stone-400 text-xs">🔍</span>
          </div>

          {/* Iconos */}
          <div className="flex items-center space-x-4 text-lg text-stone-600">
            <button className="hover:text-stone-900 transition">👤</button>
            <button className="hover:text-stone-900 transition relative">
              🛍️
              <span className="absolute -top-1.5 -right-1.5 bg-stone-900 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">0</span>
            </button>
          </div>
        </div>

        {/* Menú */}
        <nav className="border-t border-stone-100 max-w-6xl mx-auto px-6 py-2.5 flex justify-center space-x-6 text-[11px] font-medium uppercase tracking-wider text-stone-500">
          <a href="#" className="hover:text-stone-900 transition">Descubrir</a>
          <a href="#" className="hover:text-stone-900 transition">Cosméticos</a>
          <a href="#" className="hover:text-stone-900 transition">Skin Care</a>
          <a href="#" className="hover:text-stone-900 transition">Destacados</a>
          <a href="#" className="hover:text-stone-900 transition">Ayuda</a>
        </nav>
      </header>

      {/* 2. HERO BANNER - Reemplazado por caja minimalista rosa pastel */}
      <section className="w-full bg-rose-100/60 py-20 px-6 text-center border-b border-rose-200/30">
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] font-bold tracking-widest text-rose-600 uppercase">Nueva Colección</span>
          <h1 className="text-3xl md:text-4xl font-light tracking-wide text-stone-900">Cosmética Consciente & Natural</h1>
          <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">Fórmulas diseñadas para resaltar tu belleza real. Envíos a todo el país.</p>
          <div className="pt-2">
            <button className="bg-stone-900 text-white text-xs tracking-widest uppercase px-6 py-2.5 hover:bg-stone-800 transition">Ver Catálogo</button>
          </div>
        </div>
      </section>

      {/* 3. ÚLTIMOS LANZAMIENTOS - Bloques limpios */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-xs font-bold uppercase tracking-widest text-center text-stone-400 mb-10">Últimos lanzamientos</h2>
        <div className="grid grid-cols-3 gap-4 md:gap-8">
          {lanzamientos.map((prod) => (
            <div key={prod.id} className="text-center cursor-pointer group">
              <div className={`${prod.color} h-28 md:h-40 rounded flex items-center justify-center border border-stone-200/40 group-hover:opacity-90 transition`}>
                <span className="text-xl md:text-2xl opacity-40">✨</span>
              </div>
              <p className="mt-3 text-[10px] uppercase tracking-wider font-semibold text-stone-600">{prod.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. COMPRA POR CATEGORÍA */}
      <section className="max-w-6xl mx-auto px-6 py-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-center text-stone-400 mb-10">Compra por Categoría</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-32 bg-stone-100 border border-stone-200 rounded flex items-center justify-center cursor-pointer hover:bg-stone-200/50 transition">
            <span className="text-xs font-medium tracking-widest uppercase text-stone-700">Rostro</span>
          </div>
          <div className="h-32 bg-orange-50/50 border border-orange-100 rounded flex items-center justify-center cursor-pointer hover:bg-orange-100/40 transition">
            <span className="text-xs font-medium tracking-widest uppercase text-stone-700">Skin Care</span>
          </div>
          <div className="h-32 bg-rose-50/50 border border-rose-100 rounded flex items-center justify-center cursor-pointer hover:bg-rose-100/40 transition">
            <span className="text-xs font-medium tracking-widest uppercase text-stone-700">Labios</span>
          </div>
        </div>
      </section>

      {/* 5. DESTACADOS */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-xs font-bold uppercase tracking-widest text-center text-stone-400 mb-12">Destacados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {destacados.map((item) => (
            <div key={item.id} className="bg-white border border-stone-200 p-5 rounded relative flex flex-col justify-between">
              {item.tag && (
                <span className="absolute top-3 left-3 bg-rose-50 text-rose-600 text-[9px] font-bold uppercase px-2 py-0.5 rounded border border-rose-100">
                  {item.tag}
                </span>
              )}
              <div className="h-36 w-full bg-neutral-50 rounded flex items-center justify-center mb-4 text-stone-300 text-lg">
                📦
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-medium tracking-wide text-stone-600">{item.name}</h3>
                <p className="text-sm font-semibold text-stone-900 pb-3">{item.price}</p>
                <button className="w-full bg-stone-900 text-white py-2 text-xs font-medium uppercase tracking-wider hover:bg-stone-800 transition">
                  Comprar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-stone-100 border-t border-stone-200">
        {/* Newsletter */}
        <div className="bg-stone-800 text-stone-100 py-10 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-sm font-semibold tracking-wider uppercase">Newsletter</h3>
              <p className="text-xs text-stone-400">Suscribite para enterarte de lanzamientos y promociones.</p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input type="email" placeholder="Tu email..." className="px-3 py-2 bg-stone-700 text-white text-xs rounded focus:outline-none w-full md:w-56 placeholder-stone-400" />
              <button className="bg-white text-stone-900 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-stone-200 transition">Unirme</button>
            </div>
          </div>
        </div>

        {/* Contacto */}
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-stone-500">
          <div className="space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-stone-800">Contacto</h4>
            <p>📞 +54 9 11 2321-0838</p>
            <p>✉️ ventas@ambarcosmetics.com.ar</p>
            <p>📍 Av. Libertador 7000, Buenos Aires</p>
          </div>
          <div className="md:text-right space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-stone-800">Redes</h4>
            <div className="flex md:justify-end space-x-4">
              <a href="#" className="hover:text-stone-900 transition">Instagram</a>
              <a href="#" className="hover:text-stone-900 transition">Pinterest</a>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-200 py-4 text-center text-[10px] text-stone-400">
          © {new Date().getFullYear()} Ámbar Cosmetics. Todos los derechos reservados.
        </div>
      </footer>

      {/* 7. BOTÓN FLOTANTE WHATSAPP */}
      <a 
        href="https://wa.me/5491123210838" 
        target="_blank" 
        rel="noreferrer" 
        className="fixed bottom-6 right-6 bg-emerald-500 text-white w-12 h-12 rounded-full shadow-lg hover:bg-emerald-600 transition flex items-center justify-center text-xl z-50"
      >
        💬
      </a>

    </div>
  );
}