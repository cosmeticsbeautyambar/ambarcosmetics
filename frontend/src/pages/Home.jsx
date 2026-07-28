import React, { useState, useEffect } from 'react';
import logoImg from '../assets/logo.jpeg';

// Importaciones de Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules';

// Estilos de Swiper
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Carga automática de todas las imágenes .jpeg de la carpeta assets
const imageModules = import.meta.glob('../assets/*.jpeg', { eager: true });

// Convertimos los módulos en un array ordenado de rutas de imágenes
const allImages = Object.keys(imageModules)
  .sort((a, b) => {
    // Orden numérico inteligente (1, 2, ..., 18)
    const numA = parseInt(a.match(/\d+/)?.[0] || '0', 10);
    const numB = parseInt(b.match(/\d+/)?.[0] || '0', 10);
    return numA - numB;
  })
  .map((path) => imageModules[path].default)
  .filter((img) => !img.includes('logo')); // Excluimos la imagen del logo

export default function Home() {
  const [destacados, setDestacados] = useState([]);

  useEffect(() => {
    fetch('/api/productos/destacados')
      .then((res) => res.json())
      .then((data) => setDestacados(data))
      .catch((err) => console.error("Error al cargar destacados:", err));
  }, []);

  // Textos rotativos para dar variedad según la diapositiva
  const slideTexts = [
    { title: 'Cosmética Consciente & Natural', subtitle: 'Fórmulas delicadas diseñadas para resaltar la pureza de tu piel.' },
    { title: 'Nueva Colección Skin Care', subtitle: 'Nutrición profunda con ingredientes orgánicos seleccionados.' },
    { title: 'Edición Limitada Labiales', subtitle: 'Tonos atemporales e hidratación duradera para cada momento.' },
    { title: 'Ritual de Belleza Diario', subtitle: 'Siente la frescura y la suavidad que tu rostro merece.' },
    { title: 'Esencia & Pureza', subtitle: 'Cuidado integral formulado para potenciar tu brillo natural.' },
  ];

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

      {/* 2. HERO BANNER VIVO CON LAS 18 FOTOS EN INTERVALOS */}
      <section className="w-full relative overflow-hidden bg-stone-900">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination, Navigation]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={1200}
          autoplay={{
            delay: 4000, // Cambia automáticamente cada 4 segundos
            disableOnInteraction: false,
          }}
          loop={true}
          pagination={{ clickable: true }}
          navigation={true}
          className="h-[380px] md:h-[520px] w-full"
        >
          {allImages.map((imgSrc, index) => {
            const textInfo = slideTexts[index % slideTexts.length];
            return (
              <SwiperSlide key={index} className="relative w-full h-full">
                <img 
                  src={imgSrc} 
                  alt={`Ámbar Cosmetics Slide ${index + 1}`} 
                  className="w-full h-full object-cover object-center opacity-85"
                />
                
                {/* Overlay sutil para legibilidad de texto */}
                <div className="absolute inset-0 bg-stone-950/30 backdrop-brightness-95 flex items-center justify-center">
                  <div className="max-w-xl mx-auto px-6 text-center space-y-4 text-white">
                    <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase opacity-90 block drop-shadow-sm">
                      Estética & Bienestar
                    </span>
                    <h1 className="text-3xl md:text-5xl font-light tracking-wide text-white drop-shadow-md">
                      {textInfo.title}
                    </h1>
                    <p className="text-xs md:text-sm text-stone-200 max-w-md mx-auto leading-relaxed font-light drop-shadow-xs">
                      {textInfo.subtitle}
                    </p>
                    <div className="pt-2">
                      <button className="bg-white text-stone-900 text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase px-8 py-3.5 hover:bg-stone-200 transition shadow-lg">
                        Ver Catálogo
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
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