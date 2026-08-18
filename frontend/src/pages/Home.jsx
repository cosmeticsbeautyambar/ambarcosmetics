import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

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
import devLogo from '../assets/GSTECH.png'; // 👈 Logo del desarrollador

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

const SafeImage = ({ src, alt, className = "", fit = "contain" }) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`bg-stone-100 flex flex-col items-center justify-center text-stone-400 text-[10px] sm:text-xs select-none rounded-xs border border-stone-200 ${className}`}>
        <span className="text-xl sm:text-2xl mb-1">🖼️</span>
        <span>Sin foto</span>
      </div>
    );
  }

  const objectFitClass = fit === "cover" ? "object-cover" : "object-contain";

  return (
    <div className={`overflow-hidden relative w-full h-full flex items-center justify-center ${className}`}>
      <img
        src={src}
        alt={alt}
        onError={() => setError(true)}
        className={`w-full h-full ${objectFitClass} object-center transition-transform duration-300 group-hover:scale-105`}
        loading="lazy"
      />
    </div>
  );
};

const logoModules = import.meta.glob('../assets/logo.*', { eager: true });
const logoImg = Object.values(logoModules)[0]?.default || '';

const imageModules = import.meta.glob('../assets/*.{jpeg,jpg,png}', { eager: true });

const allImages = Object.keys(imageModules)
  .filter((path) => {
    const fileName = path.split('/').pop();
    const match = fileName.match(/^(\d+)\.(jpeg|jpg,png)$/i);
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

const chunkArray = (array, chunkSize) => {
  const results = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    results.push(array.slice(i, i + chunkSize));
  }
  return results;
};

const photoGroups = chunkArray(allImages, 3);

export default function Home() {
  const [latestProducts, setLatestProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const [visits, setVisits] = useState(null);

  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);

  useEffect(() => {
    fetch('https://api.countapi.xyz/hit/ambarcosmetics.com/visits')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.value) setVisits(data.value);
      })
      .catch(() => {});
  }, []);

  // CARGAR PRODUCTOS Y OBTENER SÓLO LOS ÚLTIMOS 6
  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar productos');
        return res.json();
      })
      .then((data) => {
        setAllProducts(data);
        const recentSix = [...data].reverse().slice(0, 6);
        setLatestProducts(recentSix);
      })
      .catch((err) => console.warn("Aviso productos:", err.message));
  }, []);

  // ROTACIÓN AUTOMÁTICA CADA 5 SEGUNDOS SI HAY MÁS DE 3 PRODUCTOS
  useEffect(() => {
    if (latestProducts.length <= 3) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % latestProducts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [latestProducts]);

  // CÁLCULO DE LOS 3 PRODUCTOS VISIBLES EN CADA ROTACIÓN
  const visibleProducts = latestProducts.length > 0
    ? Array.from({ length: Math.min(3, latestProducts.length) }, (_, i) => 
        latestProducts[(currentIndex + i) % latestProducts.length]
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length > 0) {
      const filtered = allProducts.filter((product) =>
        product.name?.toLowerCase().includes(value.toLowerCase()) ||
        product.category?.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filtered);
      setShowDropdown(true);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleAdminAccess = () => {
    navigate('/login');
  };

  const goToCatalogo = (category = '') => {
    setShowDropdown(false);
    if (category) {
      navigate(`/catalogo?categoria=${encodeURIComponent(category)}`);
    } else {
      navigate('/catalogo');
    }
  };

  const handleSelectProduct = (productId) => {
    setShowDropdown(false);
    setSearchTerm('');
    navigate(`/catalogo?producto=${productId}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowDropdown(false);
    if (searchTerm.trim()) {
      navigate(`/catalogo?busqueda=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/catalogo');
    }
  };

  const handleAddProduct = (item) => {
    const price = item.priceRetail || item.price || 0;
    addToCart({ ...item, price }, 1);
    alert(`🛒 ¡"${item.name}" agregado al carrito!`);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans antialiased relative">

      {/* 0. BARRA SUPERIOR DE ANUNCIOS / PROMO */}
      <div className="bg-stone-900 text-stone-100 py-1.5 px-4 text-center text-[10px] md:text-xs font-medium tracking-wider uppercase flex flex-wrap justify-center items-center gap-x-3 gap-y-0.5">
        <div className="flex items-center gap-1.5">
          <span>✨</span>
          <span>
            <strong>10% OFF</strong> en tu primera compra o en compras a partir de <strong>$50.000</strong>
          </span>
        </div>
        <span className="hidden md:inline text-rose-300">•</span>
        <div className="flex items-center gap-1.5 text-rose-200">
          <span>👑</span>
          <span>Aprovechá precios mayoristas y <strong>Convertite en revendedora</strong></span>
          <span>✨</span>
        </div>
      </div>

      {/* 1. HEADER & NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-rose-200/50 shadow-xs" style={{ backgroundColor: '#f9e5dc' }}>
        <div className="max-w-6xl mx-auto px-6 py-1.5 flex justify-between items-center gap-4">
          
          <div className="flex items-center gap-4 cursor-pointer shrink-0" onClick={() => navigate('/')}>
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
          
          {/* BUSCADOR DINÁMICO */}
          <div className="hidden md:block w-1/3 relative" ref={searchContainerRef}>
            <form 
              onSubmit={handleSearchSubmit} 
              className="flex items-center border border-stone-300/60 rounded-xs px-3 py-1 bg-white/70 backdrop-blur-xs focus-within:ring-1 focus-within:ring-stone-800"
            >
              <input 
                type="text" 
                placeholder="Buscar productos..." 
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => searchTerm.trim().length > 0 && setShowDropdown(true)}
                className="w-full bg-transparent focus:outline-none text-xs text-stone-700 placeholder-stone-500" 
              />
              <button type="submit" className="text-stone-500 text-xs hover:text-stone-900 transition" title="Buscar">
                🔍
              </button>
            </form>

            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-stone-200 shadow-lg rounded-xs z-50 max-h-64 overflow-y-auto divide-y divide-stone-100">
                {searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleSelectProduct(product._id)}
                      className="flex items-center gap-3 p-2 hover:bg-stone-50 cursor-pointer transition"
                    >
                      {product.image && (
                        <div className="w-9 h-9 shrink-0 overflow-hidden rounded-xs border border-stone-100 bg-stone-50 flex items-center justify-center">
                          <SafeImage src={product.image} alt={product.name} fit="contain" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-stone-800 truncate uppercase">{product.name}</p>
                        <p className="text-[10px] text-stone-400 uppercase tracking-wider">{product.category}</p>
                      </div>
                      <span className="text-xs font-semibold text-stone-900 shrink-0">
                        ${(product.priceRetail || product.price || 0).toLocaleString('es-AR')}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-xs text-stone-400">
                    No se encontraron productos
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* MENÚ DE CATEGORÍAS HEADER */}
        <nav className="border-t border-rose-200/40 max-w-6xl mx-auto px-6 py-2 flex justify-center space-x-8 md:space-x-12 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-700">
          <button onClick={() => goToCatalogo('Facial')} className="hover:text-stone-900 transition pb-0.5 border-b-2 border-transparent hover:border-stone-800">
            Cosméticos Faciales
          </button>
          <button onClick={() => goToCatalogo('Corporal')} className="hover:text-stone-900 transition pb-0.5 border-b-2 border-transparent hover:border-stone-800">
            Cosméticos Corporales
          </button>
          <button onClick={() => goToCatalogo('Capilar')} className="hover:text-stone-900 transition pb-0.5 border-b-2 border-transparent hover:border-stone-800">
            Cosméticos Capilares
          </button>
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
              <button 
                onClick={() => goToCatalogo()}
                className="inline-block bg-stone-900 text-white text-[10px] font-medium tracking-[0.2em] uppercase px-7 py-2.5 hover:bg-stone-800 transition shadow-xs cursor-pointer"
              >
                Ver Catálogo
              </button>
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
          <div onClick={() => goToCatalogo('Facial')} className="relative h-28 rounded-xs overflow-hidden group cursor-pointer shadow-sm border border-stone-200/80">
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
          </div>

          <div onClick={() => goToCatalogo('Corporal')} className="relative h-28 rounded-xs overflow-hidden group cursor-pointer shadow-sm border border-stone-200/80">
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
          </div>

          <div onClick={() => goToCatalogo('Capilar')} className="relative h-28 rounded-xs overflow-hidden group cursor-pointer shadow-sm border border-stone-200/80">
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
          </div>
        </div>
      </section>

      {/* 4. ÚLTIMOS LANZAMIENTOS (ROTATIVO ENTRE LOS ÚLTIMOS 6) */}
      <section id="ultimos-lanzamientos" className="max-w-3xl mx-auto px-6 py-4 scroll-mt-24">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400">
            Últimos Lanzamientos
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 transition-all duration-700 ease-in-out">
          {visibleProducts.map((item) => (
            <div key={item._id} className="bg-white border border-stone-200 p-2.5 rounded-xs relative flex flex-col justify-between shadow-2xs hover:border-stone-300 transition duration-300 group">
              
              {/* ETIQUETA "NUEVO" */}
              <span className="absolute top-2 right-2 z-10 bg-rose-500 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-xs uppercase tracking-wider">
                Nuevo
              </span>

              {/* MARCO COMPACTO Y DECORATIVO */}
              <div className="relative h-32 sm:h-36 w-full bg-stone-50/50 p-2 rounded-xs mb-2 overflow-hidden border border-stone-100 flex items-center justify-center">
                <SafeImage src={item.image} alt={item.name} fit="contain" />
              </div>

              <div className="space-y-1">
                <h3 className="text-[10px] font-medium tracking-wider text-stone-600 uppercase truncate" title={item.name}>
                  {item.name}
                </h3>
                <p className="text-xs font-semibold text-stone-900 pb-0.5">
                  ${item.priceRetail?.toLocaleString('es-AR') || item.price?.toLocaleString('es-AR')}
                </p>
                <button 
                  onClick={() => handleAddProduct(item)}
                  className="w-full bg-stone-900 text-white py-1.5 text-[9px] font-medium uppercase tracking-[0.15em] hover:bg-stone-800 transition rounded-none cursor-pointer"
                >
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
              <button 
                onClick={() => goToCatalogo()} 
                className="inline-block w-full md:w-auto bg-white text-stone-900 hover:bg-stone-200 transition py-2.5 px-6 text-[10px] font-bold uppercase tracking-[0.2em] text-center"
              >
                Ver Producto
              </button>
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
                  Descuentos Especiales & Venta Mayorista
                </h3>
                <p className="text-xs text-stone-300 font-light mt-0.5">
                  Aprovechá un <span className="text-white font-semibold underline underline-offset-2">10% OFF</span> en tu primera compra o al superar los <span className="text-white font-semibold">$50.000</span>.
                </p>
                <p className="text-xs text-rose-200 font-medium mt-1">
                  ✨ ¡Aprovechá los precios en compras mayoristas y convertite en revendedora!
                </p>
              </div>
            </div>
            <button 
              onClick={() => goToCatalogo()} 
              className="bg-white text-stone-900 px-6 py-2 text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-stone-200 transition shrink-0"
            >
              Aprovechar Descuento
            </button>
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

        <div className="border-t border-stone-200 py-4 text-center text-[9px] text-stone-400 tracking-wider space-y-1.5">
          <div>
            © {new Date().getFullYear()} ÁMBAR COSMETICS. TODOS LOS DERECHOS RESERVADOS.
          </div>
          
          <div className="text-xs md:text-sm font-medium text-stone-700 flex items-center justify-center gap-2 pt-1">
            <span className="leading-none">Desarrollado con</span>
            <span 
              onClick={handleAdminAccess}
              className="cursor-pointer hover:scale-125 inline-flex items-center transition-transform duration-200 select-none text-rose-500 text-sm md:text-base"
              title="Ámbar System"
            >
              ❤️
            </span>
            <span className="leading-none">por</span>
            <a 
              href="https://www.instagram.com/gs.tech.argentina/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center opacity-95 hover:opacity-100 hover:scale-105 transition-all duration-200 cursor-pointer ml-1"
              title="GS Tech Instagram"
            >
              <img 
                src={devLogo} 
                alt="GS Tech" 
                className="h-8 sm:h-10 md:h-11 w-auto object-contain mix-blend-multiply filter contrast-125" 
              />
            </a>
          </div>

          {visits !== null && (
            <div className="text-[8px] text-stone-400 font-mono tracking-widest uppercase pt-1 opacity-75">
              👁️ {visits.toLocaleString('es-AR')} visitas
            </div>
          )}
        </div>
      </footer>

      {/* 7. BOTONES FLOTANTES (INSTAGRAM & WHATSAPP) */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        {/* BOTÓN FLOTANTE INSTAGRAM */}
        <a 
          href="https://www.instagram.com/ambarcosmeticss?igsh=MWZtOXd4YWtuZGNtaw==" 
          target="_blank" 
          rel="noopener noreferrer" 
          title="Seguinos en Instagram"
          className="bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white w-12 h-12 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center border border-white/20"
        >
          <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>

        {/* BOTÓN FLOTANTE WHATSAPP CON LOGO OFICIAL */}
        <a 
          href="https://wa.me/5493482385840" 
          target="_blank" 
          rel="noreferrer" 
          title="Contactanos por WhatsApp"
          className="bg-[#25D366] text-white w-12 h-12 rounded-full shadow-lg hover:bg-[#20ba5a] hover:scale-110 transition-all duration-300 flex items-center justify-center border border-white/20"
        >
          <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
        </a>
      </div>

    </div>
  );
}