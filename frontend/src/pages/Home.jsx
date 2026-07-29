import React, { useState, useEffect } from 'react';
import logoImg from '../assets/logo.jpeg';

// Importaciones de Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Estilos de Swiper
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Carga automática de todas las imágenes .jpeg de assets
const imageModules = import.meta.glob('../assets/*.jpeg', { eager: true });

// Filtramos únicamente de la 1.jpeg a la 15.jpeg y las ordenamos
const allImages = Object.keys(imageModules)
  .filter((path) => {
    const fileName = path.split('/').pop();
    const match = fileName.match(/^(\d+)\.jpeg$/i);
    if (!match) return false;
    const num = parseInt(match[1], 10);
    return num >= 1 && num <= 15; // Exactamente 15 fotos
  })
  .sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)?.[0] || '0', 10);
    const numB = parseInt(b.match(/\d+/)?.[0] || '0', 10);
    return numA - numB;
  })
  .map((path) => imageModules[path].default);

// Agrupamos en 5 tríos exactos (15 fotos)
const chunkArray = (array, chunkSize) => {
  const results = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    results.push(array.slice(i, i + chunkSize));
  }
  return results;
};

const photoGroups = chunkArray(allImages, 3);

export default function Home() {
  const [destacados, setDestacados] = useState([]);

  useEffect(() => {
    fetch('/api/productos/destacados')
      .then((res) => res.json())
      .then((data) => setDestacados(data))
      .catch((err) => console.error("Error al cargar destacados:", err));
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans antialiased">

      {/* 1. HEADER & NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-rose-200/50 shadow-xs" style={{ backgroundColor: '#f9e5dc' }}>
        <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
          
          <div className="flex items-center gap-4">
            <img 
              src={logoImg} 
              alt="Logo Ámbar" 
              className="h-14 md:h-16 w-auto object-contain mix-blend-multiply" 
            />
            <div className="text-2xl md:text-3xl font-light tracking-[0.3em] text-stone-900">
              ÁMBAR
            </div>
          </div>
          
          <div className="hidden md:flex items-center border border-stone-300/60 rounded-xs px-3 py-1.5 w-1/3 bg-white/70 backdrop-blur-xs">
            <input 
              type="text" 
              placeholder="Buscar productos..." 
              className="w-full bg-transparent focus:outline-none text-xs text-stone-700 placeholder-stone-500" 
            />
            <span className="text-stone-500 text-xs">🔍</span>
          </div>

          <div className="flex items-center space-x-6 text-stone-700">
            <button className="hover:text-stone-900 transition text-sm flex items-center gap-1.5">
              👤 <span className="hidden sm:inline text-[11px] font-medium tracking-wider">Cuenta</span>
            </button>
            <button className="hover:text-stone-900 transition relative text-sm">
              🛍️
              <span className="absolute -top-1.5 -right-1.5 bg-stone-900 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">0</span>
            </button>
          </div>
        </div>

        <nav className="border-t border-rose-200/40 max-w-6xl mx-auto px-6 py-2.5 flex justify-center space-x-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-700">
          <a href="#" className="hover:text-stone-900 transition pb-0.5 border-b-2 border-transparent hover:border-stone-800">Descubrir</a>
          <a href="#" className="hover:text-stone-900 transition pb-0.5 border-b-2 border-transparent hover:border-stone-800">Cosméticos</a>
          <a href="#" className="hover:text-stone-900 transition pb-0.5 border-b-2 border-transparent hover:border-stone-800">Skin Care</a>
          <a href="#" className="hover:text-stone-900 transition pb-0.5 border-b-2 border-transparent hover:border-stone-800">Destacados</a>
          <a href="#" className="hover:text-stone-900 transition pb-0.5 border-b-2 border-transparent hover:border-stone-800">Ayuda</a>
        </nav>
      </header>

      {/* 2. HERO BANNER - NUDE & WARM AMBIENTE */}
      <section className="w-full bg-[#ebe2db] pt-5 pb-7 border-b border-rose-200/40 shadow-inner">
        <div className="w-full max-w-7xl mx-auto px-2 md:px-6">
          
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            speed={1100}
            autoplay={{
              delay: 3800,
              disableOnInteraction: false,
            }}
            loop={true}
            pagination={{ clickable: true }}
            navigation={true}
            className="w-full"
          >
            {photoGroups.map((group, groupIndex) => (
              <SwiperSlide key={groupIndex} className="pb-8">
                {/* 3 Fotos enmarcadas armoniosamente sin fondo oscuro */}
                <div className="grid grid-cols-3 gap-0 h-44 sm:h-52 md:h-60 overflow-hidden shadow-sm rounded-xs border border-stone-300/40">
                  {group.map((imgSrc, imgIndex) => (
                    <div 
                      key={imgIndex} 
                      className="relative w-full h-full overflow-hidden group cursor-pointer border-r border-stone-200/60 last:border-r-0"
                    >
                      <img 
                        src={imgSrc} 
                        alt={`Ámbar foto ${groupIndex * 3 + imgIndex + 1}`} 
                        className="w-full h-full object-cover object-center transform group-hover:scale-105 transition duration-700 ease-in-out"
                      />
                      <div className="absolute inset-0 bg-stone-900/5 group-hover:bg-transparent transition duration-300 pointer-events-none" />
                    </div>
                  ))}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* TEXTO Y BOTÓN FIJOS CON TONOS CÁLIDOS DE ÁMBAR */}
          <div className="text-center space-y-2.5 pt-2">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-stone-500 block">
              Estética & Bienestar
            </span>
            <h1 className="text-2xl md:text-3xl font-light tracking-wide text-stone-800">
              Cosmética Consciente & Natural
            </h1>
            <p className="text-xs text-stone-600 max-w-md mx-auto font-light">
              Fórmulas delicadas diseñadas para resaltar la pureza de tu piel.
            </p>
            <div className="pt-2">
              <button className="bg-stone-900 text-white text-[10px] font-medium tracking-[0.2em] uppercase px-8 py-2.5 hover:bg-stone-800 transition shadow-xs">
                Ver Catálogo
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 3. COMPRA POR CATEGORÍA */}
      <section className="max-w-5xl mx-auto px-6 py-12">
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

      {/* 4. DESTACADOS DINÁMICOS */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-center text-stone-400 mb-12">Productos Destacados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {destacados.map((item) => (
            <div key={item._id} className="bg-white border border-stone-200 p-6 rounded-xs relative flex flex-col justify-between shadow-xs hover:border-stone-300 transition duration-300">
              <div className="h-44 w-full bg-stone-50 rounded-xs mb-5 overflow-hidden flex items-center justify-center">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-2">
                <h3 className="text-[11px] font-medium tracking-wider text-stone-600 uppercase">{item.name}</h3>
                <p className="text-xs font-semibold text-stone-900 pb-2">${item.price?.toLocaleString('es-AR')}</p>
                <button className="w-full bg-stone-900 text-white py-2.5 text-[10px] font-medium uppercase tracking-[0.15em] hover:bg-stone-800 transition rounded-none">
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="bg-stone-100 border-t border-stone-200 text-xs">
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

      {/* 6. BOTÓN FLOTANTE WHATSAPP */}
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