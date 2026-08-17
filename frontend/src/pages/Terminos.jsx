import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Terminos() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Términos y Condiciones - Ámbar Cosmetics";
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
            Términos y Condiciones de Uso
          </h1>
          <p className="text-[10px] sm:text-xs text-stone-400 mt-1 uppercase tracking-widest font-medium">
            Última actualización: Agosto 2026
          </p>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="space-y-6 text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
          
          <section>
            <h2 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">
              1. Aspectos Generales
            </h2>
            <p>
              El presente sitio web es operado por <strong>Ámbar Cosmetics</strong>. Al navegar, acceder o realizar compras a través de este sitio, el usuario acepta cumplir con los términos y condiciones detallados a continuación. Si no está de acuerdo con alguno de los términos, le solicitamos abstenerse de utilizar la plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">
              2. Productos y Disponibilidad
            </h2>
            <p>
              Todos los productos cosméticos mostrados en nuestro catálogo están sujetos a disponibilidad de stock. Intentamos reflejar con la mayor exactitud posible los detalles, tonos y características de cada artículo. No obstante, las imágenes son ilustrativas y las tonalidades pueden variar según el dispositivo del usuario.
            </p>
          </section>

          <section>
            <h2 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">
              3. Precios y Modalidades de Venta
            </h2>
            <p>
              Los precios expresados en el sitio corresponden a pesos argentinos (ARS) e incluyen los impuestos aplicables. Nos reservamos el derecho de modificar precios, promociones y mínimos de venta mayorista/minorista sin previo aviso. Los precios finales aplicados serán los confirmados al momento de procesar la orden.
            </p>
          </section>

          <section>
            <h2 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">
              4. Políticas de Envío y Entregas
            </h2>
            <p>
              Realizamos envíos a través de empresas de transporte y logística tercerizadas. Los plazos y costos de entrega se calculan en función de la ubicación ingresada por el comprador. Ámbar Cosmetics no se responsabiliza por demoras imputables de forma exclusiva a las empresas de transporte o correo.
            </p>
          </section>

          <section>
            <h2 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">
              5. Cambios y Devoluciones (Botón de Arrepentimiento)
            </h2>
            <p>
              Conforme a la Ley N° 24.240 de Defensa del Consumidor de la República Argentina, el comprador dispone de un plazo de 10 (diez) días corridos desde la recepción del producto para solicitar la revocación de la compra. Por razones de higiene y seguridad en productos cosméticos, para efectuar un cambio o devolución el artículo debe encontrarse sin uso, sellado en su empaque original y en perfectas condiciones.
            </p>
          </section>

          <section>
            <h2 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">
              6. Protección de Datos Personales
            </h2>
            <p>
              Los datos recolectados a través de nuestros formularios son tratados con estricta confidencialidad de acuerdo con la Ley N° 25.326 de Protección de Datos Personales. Este sitio utiliza cookies técnicas para optimizar la experiencia de usuario y el funcionamiento del carrito de compras.
            </p>
          </section>

          <section>
            <h2 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">
              7. Propiedad Intelectual
            </h2>
            <p>
              Todos los contenidos presentes en esta plataforma (marcas, logotipos, imágenes, textos y código fuente) son propiedad de Ámbar Cosmetics o cuentan con la correspondiente autorización de uso. Queda prohibida su reproducción o redistribución sin autorización expresa.
            </p>
          </section>

          <section>
            <h2 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">
              8. Contacto
            </h2>
            <p>
              Ante cualquier consulta o reclamo relativo a estos Términos y Condiciones, podés comunicarte con nuestro equipo a través de nuestras vías oficiales de atención.
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