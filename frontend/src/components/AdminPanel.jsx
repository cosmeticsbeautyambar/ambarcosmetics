import React, { useState, useEffect } from 'react';

const getCleanApiUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'https://ambarcosmetics-api.onrender.com/api';
  if ((url.match(/https?:\/\//g) || []).length > 1) {
    const parts = url.split(/(?=https?:\/\/)/);
    url = parts[parts.length - 1];
  }
  url = url.replace(/[\[\]\(\)'"]/g, '').trim().replace(/\/+$/, '');
  if (!url.endsWith('/api')) url += '/api';
  return url;
};

const API_URL = getCleanApiUrl();

// Componente para manejar imágenes de forma segura sin romperse
const SafeImage = ({ src, alt, className = "" }) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`bg-stone-100 flex flex-col items-center justify-center text-stone-400 text-[10px] select-none ${className}`}>
        <span>🖼️</span>
        <span>Sin imagen</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className={`${className} object-contain bg-stone-50/80 p-0.5 rounded border border-stone-200/80`}
      loading="lazy"
    />
  );
};

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado del Formulario
  const [formData, setFormData] = useState({
    name: '',
    category: 'Facial',
    description: '',
    priceRetail: '',
    priceWholesale: '',
    stock: '',
    image: '',
    destacado: false
  });

  // Cargar productos
  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Error al cargar productos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Handler de inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Cargar datos en modo edición
  const handleEditClick = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name || '',
      category: product.category || 'Facial',
      description: product.description || '',
      priceRetail: product.priceRetail || product.price || '',
      priceWholesale: product.priceWholesale || '',
      stock: product.stock ?? '',
      image: product.image || '',
      destacado: product.destacado || false
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancelar Edición
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: 'Facial',
      description: '',
      priceRetail: '',
      priceWholesale: '',
      stock: '',
      image: '',
      destacado: false
    });
  };

  // Guardar (Crear o Actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isEditing = Boolean(editingId);
    const url = isEditing ? `${API_URL}/products/${editingId}` : `${API_URL}/products`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        handleCancelEdit();
        await loadProducts();
      } else {
        alert('Hubo un error al guardar el producto. Verificá los datos.');
      }
    } catch (error) {
      console.error("Error:", error);
      alert('Error de conexión con el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Eliminar Producto
  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que querés eliminar este producto?')) return;

    try {
      const res = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadProducts();
      }
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8 font-sans">
      
      {/* 1. FORMULARIO DE CREACIÓN / EDICIÓN */}
      <div className={`p-6 rounded-xl shadow-md border transition-colors ${
        editingId ? 'bg-amber-50/40 border-amber-200' : 'bg-white border-stone-200'
      }`}>
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <span className="text-xl">{editingId ? '✏️' : '➕'}</span>
            <h2 className="text-base font-bold text-stone-800">
              {editingId ? 'Editar Producto' : 'Cargar Nuevo Producto'}
            </h2>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-xs bg-stone-200 hover:bg-stone-300 text-stone-700 px-3 py-1.5 rounded-lg font-semibold transition"
            >
              ❌ Cancelar Edición
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold mb-1 text-stone-700">Nombre del producto *</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Ej: Crema Hidratante Rosas"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-stone-700">Categoría *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
            >
              <option value="Facial">Cosméticos Faciales</option>
              <option value="Corporal">Cosméticos Corporales</option>
              <option value="Capilar">Cosméticos Capilares</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold mb-1 text-stone-700">Descripción detallada</label>
            <textarea
              name="description"
              rows="3"
              placeholder="Describí beneficios, modo de uso, textura..."
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-stone-700">Precio Minorista ($) *</label>
            <input
              type="number"
              name="priceRetail"
              required
              min="0"
              placeholder="0.00"
              value={formData.priceRetail}
              onChange={handleChange}
              className="w-full p-2.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-stone-700">Stock Disponible *</label>
            <input
              type="number"
              name="stock"
              required
              min="0"
              placeholder="10"
              value={formData.stock}
              onChange={handleChange}
              className="w-full p-2.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
            />
          </div>

          {/* INPUT IMAGEN + PREVISUALIZACIÓN */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end bg-stone-50 p-3 rounded-lg border border-stone-200">
            <div className="sm:col-span-3">
              <label className="block font-semibold mb-1 text-stone-700">
                URL de la Imagen (Link directo de la foto)
              </label>
              <input
                type="text"
                name="image"
                placeholder="https://ejemplo.com/foto-hd.jpg"
                value={formData.image}
                onChange={handleChange}
                className="w-full p-2.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
              />
              <p className="text-[10px] text-stone-400 mt-1">
                Tip: Usá imágenes claras con fondo claro y buena resolución para evitar distorsiones.
              </p>
            </div>

            {/* VISTA PREVIA EN TIEMPO REAL */}
            <div className="flex flex-col items-center justify-center">
              <span className="text-[10px] font-bold text-stone-500 mb-1">Vista Previa</span>
              <SafeImage
                src={formData.image}
                alt="Previsualización"
                className="w-16 h-16 shadow-xs"
              />
            </div>
          </div>

          <div className="md:col-span-2 flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="destacado"
              name="destacado"
              checked={formData.destacado}
              onChange={handleChange}
              className="w-4 h-4 text-stone-900 rounded cursor-pointer"
            />
            <label htmlFor="destacado" className="font-semibold text-stone-700 cursor-pointer">
              ¿Mostrar en "Productos Destacados" del Home?
            </label>
          </div>

          <div className="md:col-span-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 text-white font-bold rounded-lg uppercase tracking-wider text-xs transition shadow-sm ${
                isSubmitting
                  ? 'bg-stone-400 cursor-not-allowed'
                  : editingId
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-stone-900 hover:bg-stone-800'
              }`}
            >
              {isSubmitting ? 'Guardando...' : editingId ? '💾 Guardar Cambios' : '➕ Crear Producto'}
            </button>
          </div>
        </form>
      </div>

      {/* 2. TABLA DE INVENTARIO */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-stone-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold text-stone-800 flex items-center gap-2">
            <span>📦</span> Inventario ({products.length})
          </h2>
          {loading && <span className="text-xs text-stone-400 italic">Cargando datos...</span>}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-100 text-stone-600 uppercase text-[10px] tracking-wider border-b border-stone-200">
                <th className="p-3">Foto</th>
                <th className="p-3">Producto</th>
                <th className="p-3">Categoría</th>
                <th className="p-3">Descripción</th>
                <th className="p-3">Precio</th>
                <th className="p-3">Stock</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.length === 0 && !loading ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-stone-400 italic">
                    No hay productos registrados todavía.
                  </td>
                </tr>
              ) : (
                products.map((item) => (
                  <tr key={item._id} className="hover:bg-stone-50/80 transition">
                    <td className="p-2.5">
                      {/* MINIATURA MÁS AMPLIA QUE NO SE DEFORMA */}
                      <SafeImage
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14"
                      />
                    </td>
                    <td className="p-3 font-bold text-stone-800 max-w-[180px]">
                      <div>{item.name}</div>
                      {item.destacado && (
                        <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-rose-100 text-rose-700 text-[9px] font-semibold rounded">
                          ★ Destacado
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-stone-600 font-medium">{item.category}</td>
                    <td className="p-3 text-stone-500 max-w-xs" title={item.description}>
                      <p className="line-clamp-2 leading-relaxed">
                        {item.description || <span className="italic text-stone-300">Sin descripción</span>}
                      </p>
                    </td>
                    <td className="p-3 font-bold text-stone-900">
                      ${Number(item.priceRetail || item.price || 0).toLocaleString('es-AR')}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.stock > 5 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.stock} u.
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center items-center gap-1.5">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-md font-semibold transition"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="px-2.5 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-md font-semibold transition"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}