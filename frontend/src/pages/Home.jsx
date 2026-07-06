import React from 'react';

export default function Home() {
  const lanzamientos = [
    { id: 1, name: 'Línea Rostro', color: 'bg-rose-100/40 text-rose-700' },
    { id: 2, name: 'Skin Care', color: 'bg-amber-100/40 text-amber-700' },
    { id: 3, name: 'Labiales', color: 'bg-red-100/40 text-red-700' },
  ];

  const destacados = [
    { id: 1, name: 'MÁSCARA PARA PESTAÑAS', price: '$21.000,00', icon: '👁️' },
    { id: 2, name: 'BASE BB CREAM ÁMBAR', price: '$30.000,00', icon: '✨', tag: 'Envío gratis' },
    { id: 3, name: 'CORRECTOR LÍQUIDO', price: '$24.000,00', icon: '💧' },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans antialiased">

      {/* BANNER DE ANUNCIO SUPERIOR */}
      <div className="bg-stone-900 text-white text-[10px] tracking-[0.2em] uppercase py-2 text-center font-medium">
        3 Cuotas sin interés • Envío gratis en compras mayores a $45.000
      </div>

      {/* 1. HEADER & NAVBAR */}
      <header className="border-b border-stone-200 sticky top-0 bg-white/95 backdrop-blur-md z-50 shadow-xs">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-light tracking-[0.3em] text-stone-900">ÁMBAR</div>
          
          {/* Buscador minimalista */}
          <div className="hidden md:flex items-center border border-stone-200 rounded-xs px-3 py-1.5 w-1/3 bg-stone-50">
            <input type="text" placeholder="Buscar productos..." className="w-full bg-transparent focus:outline-none text-xs text-stone-600" />
            <span className="text-stone-400 text-xs">🔍</span>
          </div>

          {/* Iconos */}
          <div className="flex items-center space-x-5 text-stone-600">
            <button className="hover:text-stone-900 transition text-sm flex items-center gap-1">👤 <span className="hidden sm:inline text-[11px] font-light tracking-wider">Cuenta</span></button>
            <button className="hover:text-stone-900 transition relative text-sm">
              🛍️
              <span className="absolute -top-1.5 -right-1.5 bg-stone-900 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">0</span>
            </button>
          </div>
        </div>

        {/* Menú de Navegación */}
        <nav className="border-t border-stone-100 max-w-6xl mx-auto px-6 py-3 flex justify-center space-x-8 text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500">
          <a href="#" className="hover:text-stone-900 transition pb-0.5 border-b border-transparent hover:border-stone-900">Descubrir</a>
          <a href="#" className="hover:text-stone-900 transition pb-0.5 border-b border-transparent hover:border-stone-900">Cosméticos</a>
          <a href="#" className="hover:text-stone-900 transition pb-0.5 border-b border-transparent hover:border-stone-900">Skin Care</a>
          <a href="#" className="hover:text-stone-900 transition pb-0.5 border-b border-transparent hover:border-stone-900">Destacados</a>
          <a href="#" className="hover:text-stone-900 transition pb-0.5 border-b border-transparent hover:border-stone-900">Ayuda</a>
        </nav>
      </header>

      {/* 2. HERO BANNER PRINCIPAL */}
      <section className="w-full bg-stone-100 py-24 px-6 text-center border-b border-stone-200">
        <div className="max-w-xl mx-auto space-y-5">
          <span className="text-[10px] font-bold tracking-[0.25em] text-stone-400 uppercase block">Estética & Bienestar</span>
          <h1 className="text-3xl md:text-4xl font-light tracking-wide text-stone-900">Cosmética Consciente & Natural</h1>
          <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed font-light">Fórmulas delicadas diseñadas para resaltar la pureza de tu piel de forma cotidiana.</p>
          <div className="pt-3">
            <button className="bg-stone-900 text-white text-[10px] tracking-[0.2em] uppercase px-8 py-3 hover:bg-stone-800 transition rounded-none">
              Ver Catálogo
            </button>
          </div>
        </div>
      </section>

      {/* 3. ÚLTIMOS LANZAMIENTOS */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-center text-stone-400 mb-12">Últimos lanzamientos</h2>
        <div className="grid grid-cols-3 gap-6">
          {lanzamientos.map((prod) => (
            <div key={prod.id} className="text-center cursor-pointer group">
              <div className={`${prod.color} h-32 md:h-44 rounded-xs flex items-center justify-center border border-stone-200/30 shadow-xs group-hover:scale-[1.01] transition duration-300`}>
                <span className="text-xl opacity-50">✨</span>
              </div>
              <p className="mt-4 text-[10px] uppercase tracking-[0.15em] font-medium text-stone-700">{prod.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. COMPRA POR CATEGORÍA */}
      <section className="max-w-5xl mx-auto px-6 py-6">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-center text-stone-400 mb-12">Compra por Categoría</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-28 bg-white border border-stone-200 rounded-xs flex items-center justify-center cursor-pointer hover:bg-stone-100 hover:border-stone-300 transition duration-300 shadow-xs">
            <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-stone-600">Rostro</span>
          </div>
          <div className="h-28 bg-white border border-stone-200 rounded-xs flex items-center justify-center cursor-pointer hover:bg-stone-100 hover:border-stone-300 transition duration-300 shadow-xs">
            <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-stone-600">Skin Care</span>
          </div>
          <div className="h-28 bg-white border border-stone-200 rounded-xs flex items-center justify-center cursor-pointer hover:bg-stone-100 hover:border-stone-300 transition duration-300 shadow-xs">
            <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-stone-600">Labios</span>
          </div>
        </div>
      </section>

      {/* 5. DESTACADOS */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-center text-stone-400 mb-12">Productos Destacados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {destacados.map((item) => (
            <div key={item.id} className="bg-white border border-stone-200 p-6 rounded-xs relative flex flex-col justify-between shadow-xs hover:border-stone-300 transition duration-300">
              {item.tag && (
                <span className="absolute top-3 left-3 bg-stone-900 text-white text-[8px] font-bold uppercase px-2 py-0.5 tracking-wider z-10">
                  {item.tag}
                </span>
              )}
              <div className="h-44 w-full bg-stone-50 rounded-xs flex items-center justify-center mb-5 text-2xl opacity-60">
                {item.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-[11px] font-medium tracking-wider text-stone-600 uppercase">{item.name}</h3>
                <p className="text-xs font-semibold text-stone-900 pb-2">{item.price}</p>
                <button className="w-full bg-stone-900 text-white py-2.5 text-[10px] font-medium uppercase tracking-[0.15em] hover:bg-stone-800 transition rounded-none">
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-stone-100 border-t border-stone-200 text-xs">
        {/* Newsletter */}
        <div className="bg-stone-900 text-stone-100 py-12 px-6">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase">Newsletter Comunidad Ámbar</h3>
              <p className="text-xs text-stone-400 font-light">Suscribite para recibir novedades exclusivas y un 10% OFF en tu primera compra.</p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input type="email" placeholder="Tu dirección de email" className="px-3 py-2 bg-stone-800 text-white text-xs border border-stone-700 rounded-none focus:outline-none w-full md:w-60 placeholder-stone-500" />
              <button className="bg-white text-stone-900 px-5 py-2 text-[10px] font-bold uppercase tracking-wider hover:bg-stone-200 transition">Unirme</button>
            </div>
          </div>
        </div>

        {/* Info Contacto */}
        <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-stone-500 font-light">
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-stone-800 text-[10px]">Atención al Cliente</h4>
            <p>📞 +54 9 11 2321-0838</p>
            <p>✉️ consultas@ambarcosmetics.com.ar</p>
            <p>📍 Showroom: Av. Libertador, Buenos Aires</p>
          </div>
          <div className="md:text-right space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-stone-800 text-[10px]">Seguinos</h4>
            <div className="flex md:justify-end space-x-6">
              <a href="#" className="hover:text-stone-900 transition">Instagram</a>
              <a href="#" className="hover:text-stone-900 transition">Pinterest</a>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-200 py-4 text-center text-[9px] text-stone-400 tracking-wider">
          © {new Date().getFullYear()} ÁMBAR COSMETICS. TODOS LOS DERECHOS RESERVADOS.
        </div>
      </footer>

      {/* 7. BOTÓN FLOTANTE WHATSAPP */}
      <a 
        href="https://wa.me/5491123210838" 
        target="_blank" 
        rel="noreferrer" 
        className="fixed bottom-6 right-6 bg-stone-900 text-white w-12 h-12 rounded-full shadow-md hover:bg-stone-800 transition flex items-center justify-center text-lg z-50 border border-stone-700"
      >
        💬
      </a>

    </div>
  );
}