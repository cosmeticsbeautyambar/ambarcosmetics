import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Privacidad() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Política de Privacidad - Ámbar Cosmetics";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans py-10 px-4 sm:px-6 overflow-y-scroll">
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-rose-200 shadow-sm space-y-6">
        
        {/* ENCABEZADO */}
        <div className="border-b border-rose-100 pb-4 text-center sm:text-left">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-rose-800 hover:text-stone-900 font-semibold uppercase tracking-wider mb-2 inline-flex items-center gap-1 transition"
          >
            ← Volver al inicio
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 uppercase tracking-wide">
            Política de Privacidad
          </h1>
          <p className="text-[10px] sm:text-xs text-stone-400 mt-1 uppercase tracking-widest font-medium">
            Última actualización: Agosto 2026
          </p>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="space-y-6 text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
          
          <section>
            <h2 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">
              1. Recolección de Información
            </h2>
            <p>
              En <strong>Ámbar Cosmetics</strong> recolectamos únicamente la información personal estrictamente necesaria para procesar tus compras y envíos (nombre, teléfono, dirección y datos de entrega). No almacenamos datos sensibles de tarjetas o credenciales bancarias.
            </p>
          </section>

          <section>
            <h2 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">
              2. Uso de la Información
            </h2>
            <p>
              Tus datos son utilizados de manera confidencial para la gestión logística de los pedidos, la atención al cliente y la mejora continua de la experiencia de compra. No vendemos ni compartimos tu información con terceros con fines comerciales ajenos a nuestra tienda.
            </p>
          </section>

          <section>
            <h2 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">
              3. Cookies y Servicios de Terceros
            </h2>
            <p>
              Utilizamos cookies técnicas necesarias para el funcionamiento del carrito de compras. Asimismo, empleamos herramientas de métrica como <strong>Google Analytics</strong> para analizar el tráfico del sitio y reproductores de video de <strong>YouTube</strong> para mostrar demostraciones de productos.
            </p>
            <p className="mt-2">
              Estos proveedores externos pueden recolectar datos de navegación técnica según sus respectivas políticas de privacidad. Podés consultar más detalles en la <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-rose-700 underline hover:text-stone-900">Política de Privacidad de Google</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">
              4. Protección y Derechos del Usuario
            </h2>
            <p>
              De acuerdo con la Ley N° 25.326 de Protección de Datos Personales, tenés derecho a acceder, rectificar o solicitar la eliminación de tus datos personales de nuestra base de datos poniéndote en contacto con nosotros a través de nuestras vías oficiales.
            </p>
          </section>

        </div>

        {/* PIE DE PÁGINA INTERNO */}
        <div className="border-t border-rose-100 pt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="bg-stone-900 text-white text-xs font-bold tracking-wider uppercase px-6 py-3 rounded-xl hover:bg-stone-800 transition active:scale-95 cursor-pointer shadow-sm"
          >
            Entendido / Volver a la Tienda
          </button>
        </div>

      </div>
    </div>
  );
}