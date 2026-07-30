import React, { useState, useContext } from 'react';
import { ProductContext } from './ProductContext';
import { AuthContext } from '../context/AuthContext';

export default function AdminPanel() {
  const { products, addProduct, updateStock, updatePrices, deleteProduct } = useContext(ProductContext);
  const { user, logout } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Formulario de Alta
  const [formData, setFormData] = useState({
    name: '',
    category: 'Faciales',
    description: '',
    priceRetail: '',
    priceWholesale: '',
    minWholesaleQty: '6',
    stock: '',
    image: ''
  });

  const [imagePreview, setImagePreview] = useState(null);

  // Procesador de imagen con autocrop/fit
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.name || !formData.priceRetail || !formData.priceWholesale || !formData.stock) {
      setErrorMessage('Por favor completá los campos obligatorios (*).');
      return;
    }

    setLoading(true);

    const defaultImg = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600';
    
    // Llamada asíncrona real al backend mediante el ProductContext
    const response = await addProduct({
      ...formData,
      image: formData.image || defaultImg
    });

    setLoading(false);

    if (response && response.success) {
      setSuccessMessage('✨ ¡Producto publicado con éxito en MongoDB Atlas!');
      // Limpiar formulario solo si la publicación en BD fue exitosa
      setFormData({
        name: '',
        category: 'Faciales',
        description: '',
        priceRetail: '',
        priceWholesale: '',
        minWholesaleQty: '6',
        stock: '',
        image: ''
      });
      setImagePreview(null);
    } else {
      setErrorMessage(response?.message || 'Error al conectar o guardar el producto en el servidor.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 text-stone-800 font-sans">
      
      {/* CABECERA */}
      <div className="flex justify-between items-center border-b border-stone-200 pb-4">
        <div>
          <span className="text-[10px] font-bold tracking-[0.25em] text-rose-400 uppercase">Ámbar Cosmetics</span>
          <h1 className="text-xl font-light tracking-wide uppercase text-stone-900">Panel de Control de Stock & Precios</h1>
          {user?.email && (
            <p className="text-[11px] text-stone-500 mt-0.5">Sesión activa: <span className="font-semibold text-stone-700">{user.email}</span></p>
          )}
        </div>
        <button 
          onClick={logout} 
          className="text-xs font-medium text-stone-500 hover:text-stone-900 underline uppercase tracking-wider"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* ALERTAS DE ESTADO */}
      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-md text-center font-medium">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md text-center font-medium">
          {successMessage}
        </div>
      )}

      {/* FORMULARIO DE ALTA DE PRODUCTO */}
      <div className="bg-white border border-stone-200 p-6 shadow-xs">
        <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-stone-700 mb-6 flex items-center gap-2">
          <span>📦</span> Dar de Alta Nuevo Producto
        </h2>

        <form onSubmit={handleSubmitProduct} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* COLUMNA 1: FOTO & PREVIEW */}
          <div className="space-y-3">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-600">
              Foto del Producto
            </label>
            
            <div className="w-full aspect-square bg-stone-100 border-2 border-dashed border-stone-300 flex flex-col items-center justify-center relative overflow-hidden group">
              {imagePreview ? (
                <>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover object-center" 
                  />
                  <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-wider">
                    Cambiar Foto
                  </div>
                </>
              ) : (
                <div className="text-center p-4">
                  <span className="text-2xl block mb-1">📸</span>
                  <span className="text-[10px] text-stone-500 font-light block">
                    Formatos JPG, PNG (Ajuste a 1:1)
                  </span>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
              />
            </div>
            <p className="text-[10px] text-stone-400 text-center italic">
              Máximo recomendado: 5MB
            </p>
          </div>

          {/* COLUMNA 2: DETALLES BÁSICOS */}
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                Nombre del Cosmético *
              </label>
              <input 
                type="text" 
                placeholder="Ej: Labial Velvet Rosé" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 text-xs focus:outline-none focus:border-stone-800"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                Categoría *
              </label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 text-xs focus:outline-none focus:border-stone-800 bg-white"
              >
                <option value="Faciales">Cosméticos Faciales</option>
                <option value="Corporales">Cosméticos Corporales</option>
                <option value="Capilares">Cosméticos Capilares</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                Descripción Breve
              </label>
              <textarea 
                rows="3"
                placeholder="Beneficios, textura o ingredientes principales..." 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 text-xs focus:outline-none focus:border-stone-800"
              />
            </div>
          </div>

          {/* COLUMNA 3: PRECIOS DUALES Y STOCK */}
          <div className="space-y-4 bg-stone-50 p-4 border border-stone-200">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-700 border-b border-stone-200 pb-1">
              Valores & Stock
            </h3>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                Precio Minorista ($) *
              </label>
              <input 
                type="number" 
                placeholder="8500" 
                value={formData.priceRetail}
                onChange={(e) => setFormData({ ...formData, priceRetail: e.target.value })}
                className="w-full px-3 py-1.5 border border-stone-300 text-xs focus:outline-none focus:border-stone-800 bg-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Precio Mayorista ($) *
                </label>
                <input 
                  type="number" 
                  placeholder="5200" 
                  value={formData.priceWholesale}
                  onChange={(e) => setFormData({ ...formData, priceWholesale: e.target.value })}
                  className="w-full px-3 py-1.5 border border-stone-300 text-xs focus:outline-none focus:border-stone-800 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Mín. Mayorista (u.)
                </label>
                <input 
                  type="number" 
                  placeholder="6" 
                  value={formData.minWholesaleQty}
                  onChange={(e) => setFormData({ ...formData, minWholesaleQty: e.target.value })}
                  className="w-full px-3 py-1.5 border border-stone-300 text-xs focus:outline-none focus:border-stone-800 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                Stock Inicial disponible *
              </label>
              <input 
                type="number" 
                placeholder="20" 
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3 py-1.5 border border-stone-300 text-xs focus:outline-none focus:border-stone-800 bg-white"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-stone-900 text-white py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-stone-800 transition shadow-xs mt-2 disabled:opacity-50"
            >
              {loading ? 'Guardando en Servidor...' : 'Publicar Producto'}
            </button>
          </div>

        </form>
      </div>

      {/* TABLA DE GESTIÓN Y ACTUALIZACIÓN EN TIEMPO REAL */}
      <div className="bg-white border border-stone-200 p-6 shadow-xs">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-stone-700">
            Inventario & Edición Rápida ({products.length})
          </h2>
          <span className="text-[10px] text-stone-400">
            Los cambios se reflejan inmediatamente en el catálogo.
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-[10px] uppercase font-bold tracking-wider text-stone-500">
                <th className="p-3">Producto</th>
                <th className="p-3">Categoría</th>
                <th className="p-3">Precio Minorista</th>
                <th className="p-3">Precio Mayorista (Mín u.)</th>
                <th className="p-3">Stock Actual</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-stone-50/60 transition">
                  {/* FOTO + NOMBRE */}
                  <td className="p-3 flex items-center gap-3">
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="w-10 h-10 object-cover rounded-none border border-stone-200 shrink-0" 
                    />
                    <div>
                      <p className="font-semibold text-stone-800">{p.name}</p>
                      <p className="text-[10px] text-stone-400 line-clamp-1 max-w-xs">{p.description}</p>
                    </div>
                  </td>

                  {/* CATEGORÍA */}
                  <td className="p-3 text-stone-600">{p.category}</td>

                  {/* EDITAR PRECIO MINORISTA */}
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <span className="text-stone-400">$</span>
                      <input 
                        type="number" 
                        value={p.priceRetail}
                        onChange={(e) => updatePrices(p._id, e.target.value, p.priceWholesale)}
                        className="w-20 px-2 py-1 border border-stone-200 rounded-none text-xs focus:outline-none focus:border-stone-800"
                      />
                    </div>
                  </td>

                  {/* EDITAR PRECIO MAYORISTA */}
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <span className="text-stone-400">$</span>
                      <input 
                        type="number" 
                        value={p.priceWholesale}
                        onChange={(e) => updatePrices(p._id, p.priceRetail, e.target.value)}
                        className="w-20 px-2 py-1 border border-stone-200 rounded-none text-xs focus:outline-none focus:border-stone-800"
                      />
                      <span className="text-[10px] text-stone-400 font-light">({p.minWholesaleQty || 1} u.)</span>
                    </div>
                  </td>

                  {/* EDITAR STOCK EN VIVO */}
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        value={p.stock}
                        onChange={(e) => updateStock(p._id, e.target.value)}
                        className={`w-16 px-2 py-1 border rounded-none text-xs font-bold focus:outline-none ${
                          p.stock === 0 
                            ? 'border-rose-400 text-rose-600 bg-rose-50' 
                            : 'border-stone-200 text-stone-800'
                        }`}
                      />
                      <span className="text-[10px] text-stone-400">un.</span>
                    </div>
                  </td>

                  {/* ELIMINAR */}
                  <td className="p-3 text-center">
                    <button 
                      onClick={() => {
                        if (confirm(`¿Bajar de catálogo "${p.name}"?`)) deleteProduct(p._id);
                      }}
                      className="text-stone-400 hover:text-rose-600 transition text-sm"
                      title="Eliminar producto"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}