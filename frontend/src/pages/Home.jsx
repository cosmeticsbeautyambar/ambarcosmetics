import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // O la librería de ruteo que utilices

// Importaciones de Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Estilos de Swiper
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// IMPORTACIÓN DE MULTIMEDIA DESDE SRC/ASSETS
import promoVideo from '../assets/banner-promo.mp4';
import imgFacial from '../assets/facial.png';
import imgCorporal from '../assets/corporal.png';
import imgCapilar from '../assets/capilar.png';

// Obtenemos la URL de la API sanitizada y anti-duplicados
const getCleanApiUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'https://ambarcosmetics-api.onrender.com/api';

  if ((url.match(/https?:\/\//g) || []).length > 1) {
    const parts = url.split(/(?=https?:\/\/)/);
    url = parts[parts.length - 1];
  }

  url = url.replace(/[\[\]\(\)'"]/g, '').trim().replace(/\/+$/, '');

  if (!url.endsWith('/api')) {
    url += '/api';
  }

  return url;
};

const API_URL = getCleanApiUrl();

// Carga dinámica del logo
const logoModules = import.meta.glob('../assets/logo.*', { eager: true });
const logoImg = Object.values(logoModules)[0]?.default || '';

// Carga de imágenes de productos (del 1 al 12)
const imageModules = import.meta.glob('../assets/*.{jpeg,jpg,png}', { eager: true });

const allImages = Object.keys(imageModules)
  .filter((path) => {
    const fileName = path.split('/').pop();
    const match = fileName.match(/^(\d+)\.(jpeg|jpg|png)$/i);
    if (!match) return false;
    const num = parseInt(match[1], 10);
    return num >= 1 && num <= 12;
  })
  .sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)?.[0] || '0', 10);
    const numB = parseInt(b.match(/\d+/)?.[0] || '0', 10);
    return numA - numB;
  })
  .map((path) => imageModules[path].default);

// Agrupamos en tríos
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
  const navigate = useNavigate(); // Hook para navegación

  useEffect(() => {
    fetch(`${API_URL}/products/destacados`)
      .then((res) => {
        if (!res.ok) throw new Error('API no disponible por el momento');
        return res.json();
      })
      .then((data) => setDestacados(data))
      .catch((err) => console.warn("Aviso:", err.message));
  }, []);

  // Función sutil para acceder al Panel Logístico / Login
  const handleAdminAccess = () => {
    navigate('/login'); // Cambiá '/login' por la ruta de tu panel logístico si difiere
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans antialiased relative">

      {/* 0. BARRA SUPERIOR DE ANUNCIOS / PROMO */}
      <div className="bg-stone-900 text-stone-100 py-1.5 px-4 text-center text-[10px] md:text-xs font-medium tracking-wider uppercase flex justify-center items-center gap-2">
        <span>✨</span>
        <span>
          <strong>10% OFF</strong> en tu primera compra o en compras a partir de <strong>$50.000</strong>
        </span>
        <span>✨</span>
      </div>

      {/* 1. HEADER & NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-rose-200/50 shadow-xs" style={{ backgroundColor: '#f9e5dc' }}>
        <div className="max-w-6xl mx-auto px-6 py-1.5 flex justify-between items-center">
          
          <div className="flex items-center gap-4">
            {logoImg && (
              <img 
                src={logoImg} 
                alt="Logo Ámbar" 
                className="h-16 md:h-20 w-auto object-contain mix-blend-multiply -my-1" 
              />
            )}
            <div className="text-xl md:text-2xl font-light tracking-[0.3em] text-stone-900">
              ÁMBAR
            </div>
          </div>
          
          <div className="hidden md:flex items-center border border-stone-300/60 rounded-xs px-3 py-1 w-1/3 bg-white/70 backdrop-blur-xs">
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

        {/* MENÚ DE NAVEGACIÓN */}
        <nav className="border-t border-rose-200/40 max-w-6xl mx-auto px-6 py-2 flex justify-center space-x-8 md:space-x-12 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-700">
          <a href="#faciales" className="hover:text-stone-900 transition pb-0.5 border-b-2 border-transparent hover:border-stone-800">
            Cosméticos Faciales
          </a>
          <a href="#corporales" className="hover:text-stone-900 transition pb-0.5 border-b-2 border-transparent hover:border-stone-800">
            Cosméticos Corporales
          </a>
          <a href="#capilares" className="hover:text-stone-900 transition pb-0.5 border-b-2 border-transparent hover:border-stone-800">
            Cosméticos Capilares
          </a>
        </nav>
      </header>

      {/* 2. HERO BANNER */}
      <section className="w-full bg-[#ebe2db] pt-4 pb-5 border-b border-rose-200/40 shadow-inner">
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
              <SwiperSlide key={groupIndex} className="pb-6">
                <div className="grid grid-cols-3 gap-0 h-40 sm:h-48 md:h-56 overflow-hidden shadow-sm rounded-xs border border-stone-300/40">
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

          <div className="text-center space-y-2 pt-1">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-stone-500 block">
              Estética & Bienestar
            </span>
            <h1 className="text-xl md:text-2xl font-light tracking-wide text-stone-800">
              Cosmética Consciente & Natural
            </h1>
            <p className="text-xs text-stone-600 max-w-md mx-auto font-light">
              Fórmulas delicadas diseñadas para resaltar la pureza de tu piel.
            </p>
            <div className="pt-1">
              <a 
                href="#destacados" 
                className="inline-block bg-stone-900 text-white text-[10px] font-medium tracking-[0.2em] uppercase px-7 py-2.5 hover:bg-stone-800 transition shadow-xs cursor-pointer"
              >
                Ver Catálogo
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 3. COMPRA POR CATEGORÍA */}
      <section className="max-w-5xl mx-auto px-6 py-6">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-center text-stone-400 mb-5">
          Compra por Categoría
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="#faciales" className="relative h-28 rounded-xs overflow-hidden group cursor-pointer shadow-sm border border-stone-200/80">
            <img 
              src={imgFacial} 
              alt="Cosméticos Faciales" 
              className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-stone-900/40 group-hover:bg-stone-900/30 transition duration-300 flex items-center justify-center p-3">
              <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-white drop-shadow-md text-center">
                Cosméticos Faciales
              </span>
            </div>
          </a>

          <a href="#corporales" className="relative h-28 rounded-xs overflow-hidden group cursor-pointer shadow-sm border border-stone-200/80">
            <img 
              src={imgCorporal} 
              alt="Cosméticos Corporales" 
              className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-stone-900/40 group-hover:bg-stone-900/30 transition duration-300 flex items-center justify-center p-3">
              <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-white drop-shadow-md text-center">
                Cosméticos Corporales
              </span>
            </div>
          </a>

          <a href="#capilares" className="relative h-28 rounded-xs overflow-hidden group cursor-pointer shadow-sm border border-stone-200/80">
            <img 
              src={imgCapilar} 
              alt="Cosméticos Capilares" 
              className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-stone-900/40 group-hover:bg-stone-900/30 transition duration-300 flex items-center justify-center p-3">
              <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-white drop-shadow-md text-center">
                Cosméticos Capilares
              </span>
            </div>
          </a>
        </div>
      </section>

      {/* 4. PRODUCTOS DESTACADOS DINÁMICOS */}
      <section id="destacados" className="max-w-5xl mx-auto px-6 py-6 scroll-mt-24">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-center text-stone-400 mb-5">
          Productos Destacados
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {destacados.map((item) => (
            <div key={item._id} className="bg-white border border-stone-200 p-5 rounded-xs relative flex flex-col justify-between shadow-xs hover:border-stone-300 transition duration-300">
              <div className="h-40 w-full bg-stone-50 rounded-xs mb-4 overflow-hidden flex items-center justify-center">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-[11px] font-medium tracking-wider text-stone-600 uppercase">{item.name}</h3>
                <p className="text-xs font-semibold text-stone-900 pb-1">${item.priceRetail?.toLocaleString('es-AR') || item.price?.toLocaleString('es-AR')}</p>
                <button className="w-full bg-stone-900 text-white py-2 text-[10px] font-medium uppercase tracking-[0.15em] hover:bg-stone-800 transition rounded-none">
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. BANNER PROMOCIONAL COMPACTO */}
      <section className="max-w-5xl mx-auto px-6 my-6">
        <div className="bg-stone-900 border border-stone-800 rounded-xs shadow-lg overflow-hidden flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 h-52 md:h-56 bg-stone-950 relative overflow-hidden">
            <video autoPlay loop muted playsInline className="w-full h-full object-cover">
              <source src={promoVideo} type="video/mp4" />
              Tu navegador no soporta el video.
            </video>
          </div>

          <div className="w-full md:w-1/2 p-6 md:p-8 text-center md:text-left flex flex-col justify-center items-center md:items-start space-y-3 text-white">
            <span className="text-[9px] font-extrabold uppercase tracking-[0.3em] text-rose-200 block">
              ★ EL MÁS PEDIDO ★
            </span>
            <h3 className="text-lg md:text-xl font-light tracking-widest uppercase text-stone-100">
              Body Splash con Glitter
            </h3>
            <p className="text-xs text-stone-300 font-light leading-relaxed max-w-md">
              Aporta un brillo sutil deslumbrante y una fragancia envolvente que te acompaña durante todo el día.
            </p>
            <div className="pt-1 w-full md:w-auto">
              <a 
                href="#destacados" 
                className="inline-block w-full md:w-auto bg-white text-stone-900 hover:bg-stone-200 transition py-2.5 px-6 text-[10px] font-bold uppercase tracking-[0.2em] text-center"
              >
                Ver Producto
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-stone-100 border-t border-stone-200 text-xs">
        <div className="bg-stone-900 text-stone-100 py-6 px-6">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎁</span>
              <div>
                <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-rose-200">
                  Descuentos Especiales Ámbar
                </h3>
                <p className="text-xs text-stone-300 font-light mt-0.5">
                  Aprovechá un <span className="text-white font-semibold underline underline-offset-2">10% OFF</span> en tu primera compra o al superar los <span className="text-white font-semibold">$50.000</span>.
                </p>
              </div>
            </div>
            <a 
              href="#destacados" 
              className="bg-white text-stone-900 px-6 py-2 text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-stone-200 transition shrink-0"
            >
              Aprovechar Descuento
            </a>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-stone-600 font-light">
          <div className="space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-stone-800 text-[10px]">Atención al Cliente</h4>
            <p className="flex items-center gap-2">
              📞 <a href="https://wa.me/5493482385840" target="_blank" rel="noreferrer" className="hover:text-stone-900 transition">+54 9 3482 38-5840</a>
            </p>
            <p className="flex items-center gap-2">
              ✉️ <a href="mailto:cosmetics.beauty.ambar@gmail.com" className="hover:text-stone-900 transition">cosmetics.beauty.ambar@gmail.com</a>
            </p>
            <p className="flex items-center gap-2">
              🚚 Envíos a todo el país
            </p>
          </div>

          <div className="md:text-right space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-stone-800 text-[10px]">Seguinos</h4>
            <div className="flex md:justify-end items-center">
              <a 
                href="https://www.instagram.com/ambarcosmeticss?igsh=MWZtOXd4YWtuZGNtaw==" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 hover:text-stone-900 transition font-medium group"
              >
                <svg className="w-5 h-5 fill-current text-stone-700 group-hover:text-stone-900 transition" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="text-xs font-normal">@ambarcosmeticss</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-200 py-4 text-center text-[9px] text-stone-400 tracking-wider space-y-1">
          <div>
            © {new Date().getFullYear()} ÁMBAR COSMETICS. TODOS LOS DERECHOS RESERVADOS.
          </div>
          <div className="text-[10px] font-medium text-stone-500">
            Desarrollado con{' '}
            {/* 🔒 ACCESO DISCRETO AL PANEL ADMIN (Hacer clic en el corazón) */}
            <span 
              onClick={handleAdminAccess}
              className="cursor-pointer hover:scale-125 inline-block transition-transform duration-200 select-none"
              title="Ámbar System"
            >
              🤍
            </span>{' '}
            por{' '}
            <span className="text-stone-800 font-bold tracking-widest hover:text-rose-500 transition cursor-pointer">
              GalmaTech
            </span>
          </div>
        </div>
      </footer>

      {/* 7. BOTÓN FLOTANTE WHATSAPP */}
      <a 
        href="https://wa.me/5493482385840" 
        target="_blank" 
        rel="noreferrer" 
        className="fixed bottom-6 right-6 bg-stone-900 text-white w-12 h-12 rounded-full shadow-md hover:bg-stone-800 transition flex items-center justify-center text-lg z-50 border border-stone-700"
      >
        💬
      </a>

    </div>
  );
}