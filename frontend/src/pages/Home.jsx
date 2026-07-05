import React from 'react';

export default function Home() {
  // Datos de prueba temporales para simular tus productos
  const lanzamientos = [
    { id: 1, name: 'Línea Rostro', image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Skin Care', image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Labiales', image: 'https://via.placeholder.com/150' },
  ];

  const destacados = [
    { id: 1, name: 'Máscara para pestañas', price: '$21.000,00', image: 'https://via.placeholder.com/250' },
    { id: 2, name: 'Base BB Cream Ámbar', price: '$30.000,00', image: 'https://via.placeholder.com/250', tag: 'Envío gratis' },
    { id: 3, name: 'Corrector Líquido', price: '$24.000,00', image: 'https://via.placeholder.com/250' },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans relative">

      {/* 1. HEADER & NAVBAR (image_6f934a.jpg) */}
      <header className="border-b border-gray-100 sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-widest text-gray-900">ÁMBAR</div>
          
          {/* Buscador */}
          <div className="hidden md:flex items-center border border-gray-300 rounded-md px-3 py-1 w-1/3">
            <input type="text" placeholder="Buscar..." className="w-full focus:outline-none text-sm" />
            <span className="text-gray-400">🔍</span>
          </div>

          {/* Iconos Usuario y Carrito */}
          <div className="flex items-center space-x-6 text-xl">
            <button className="hover:text-pink-500">👤</button>
            <button className="hover:text-pink-500 relative">
              🛍️
              <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">0</span>
            </button>
          </div>
        </div>

        {/* Selector de Páginas / Navegación */}
        <nav className="max-w-7xl mx-auto px-4 py-2 flex justify-center space-x-8 text-xs font-semibold uppercase tracking-wider text-gray-600">
          <a href="#" className="hover:text-black">Descubrir</a>
          <a href="#" className="hover:text-black">Cosméticos</a>
          <a href="#" className="hover:text-black">Skin Care</a>
          <a href="#" className="hover:text-black">Destacados</a>
          <a href="#" className="hover:text-black">Ayuda</a>
        </nav>
      </header>

      {/* 2. BANNER PRINCIPAL / HERO (image_6f934a.jpg) */}
      {/* Usamos object-cover y un contenedor con altura controlada para que la foto no se corte feo */}
      <section className="relative w-full h-[60vh] md:h-[80vh] bg-gray-100 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1920" 
          alt="Banner Principal" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/5 flex items-center justify-between px-4">
          <button className="bg-white/50 p-2 rounded-full">◀</button>
          <button className="bg-white/50 p-2 rounded-full">▶</button>
        </div>
      </section>

      {/* 3. ÚLTIMOS LANZAMIENTOS (image_6f96ae.png) */}
      <section className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-xl font-bold uppercase tracking-widest mb-8">Últimos lanzamientos</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {lanzamientos.map((prod) => (
            <div key={prod.id} className="group cursor-pointer">
              <div className="overflow-hidden bg-gray-50 rounded-lg p-4">
                <img src={prod.image} alt={prod.name} className="mx-auto mix-blend-multiply group-hover:scale-105 transition duration-300" />
              </div>
              <p className="mt-3 text-xs uppercase tracking-wider font-semibold text-gray-500">{prod.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. COMPRA POR CATEGORÍA (image_6f9725.jpg - Ajustado el tamaño para cuidar la experiencia) */}
      <section className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-xl font-bold uppercase tracking-widest mb-8">Compra por Categoría</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative h-64 bg-gray-200 overflow-hidden group cursor-pointer rounded-md">
            <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="Rostro"/>
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <span className="text-white font-bold tracking-widest uppercase">Rostro</span>
            </div>
          </div>
          <div className="relative h-64 bg-gray-200 overflow-hidden group cursor-pointer rounded-md">
            <img src="https://images.unsplash.com/photo-1608248597481-496100c8c836?w=500" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="Skin Care"/>
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <span className="text-white font-bold tracking-widest uppercase">Skin Care</span>
            </div>
          </div>
          <div className="relative h-64 bg-gray-200 overflow-hidden group cursor-pointer rounded-md">
            <img src="https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="Labios"/>
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <span className="text-white font-bold tracking-widest uppercase">Labios</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DESTACADOS (image_6f9a4a.png) */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold uppercase tracking-widest text-center mb-10">Destacados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {destacados.map((item) => (
            <div key={item.id} className="relative flex flex-col justify-between border border-gray-50 p-4 rounded-md shadow-sm">
              {item.tag && (
                <span className="absolute top-2 left-2 bg-pink-100 text-pink-700 text-[10px] font-bold uppercase px-2 py-1 rounded">
                  {item.tag}
                </span>
              )}
              <img src={item.image} alt={item.name} className="w-full h-56 object-contain mb-4" />
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">{item.name}</h3>
                <p className="text-base font-bold text-gray-900 mb-4">{item.price}</p>
                <button className="w-full bg-gray-500 text-white py-2 text-sm font-semibold rounded hover:bg-gray-600 transition">
                  Comprar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FOOTER E INFORMACIÓN EXTRA (image_6f9a6a.png) */}
      <footer className="bg-gray-100 mt-20 border-t border-gray-200">
        {/* Newsletter */}
        <div className="bg-slate-500 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-lg font-bold tracking-wider">Newsletter</h3>
              <p className="text-sm text-gray-200">Registrate y recibí nuestras ofertas.</p>
            </div>
            <div className="flex w-full sm:w-auto gap-2">
              <input type="email" placeholder="Ingresá tu email..." className="px-4 py-2 text-black text-sm rounded-sm focus:outline-none w-full sm:w-64" />
              <button className="bg-transparent border border-white px-6 py-2 text-sm font-bold uppercase tracking-wider hover:bg-white hover:text-slate-500 transition">Enviar</button>
            </div>
          </div>
        </div>

        {/* Datos de Contacto */}
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm text-gray-600">
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Contactanos</h4>
            <p className="mb-2">📞 5491123210838</p>
            <p className="mb-2">✉️ ventas@ambarcosmetics.com.ar</p>
            <p>📍 Libertador 7000, Buenos Aires</p>
          </div>
          <div className="sm:text-right">
            <h4 className="font-bold text-gray-900 mb-4">Redes Sociales</h4>
            <div className="flex sm:justify-end space-x-4 text-xl">
              <a href="#" className="hover:text-pink-500">📸 Instagram</a>
              <a href="#" className="hover:text-pink-500">📌 Pinterest</a>
            </div>
          </div>
        </div>

        {/* Derechos */}
        <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-400">
          Copyright Ámbar Cosmetics - {new Date().getFullYear()}. Todos los derechos reservados.
        </div>
      </footer>

      {/* 7. BOTÓN FLOTANTE DE WHATSAPP (image_6f934a.jpg) */}
      <a 
        href="https://wa.me/5491123210838" 
        target="_blank" 
        rel="noreferrer" 
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition duration-300 z-50 flex items-center justify-center text-2xl"
      >
        💬
      </a>

    </div>
  );
}