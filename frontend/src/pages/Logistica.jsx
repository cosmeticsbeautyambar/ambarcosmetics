import React, { useState } from 'react';

export default function Logistica() {
  // Simulación de control de stock de productos
  const [products, setProducts] = useState([
    { _id: '1', name: 'Labial Matte Velvet', price: 1200, stock: 15 },
    { _id: '2', name: 'Máscara pestañas HD', price: 1500, stock: 8 }
  ]);

  const handlePriceChange = (id, newPrice) => {
    setProducts(products.map(p => p._id === id ? { ...p, price: Number(newPrice) } : p));
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-2 text-gray-800">Panel de Administración</h2>
      <p className="text-gray-500 mb-8">Control de productos, actualización de precios y altas/bajas.</p>
      
      {/* Formulario rápido de Alta */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
        <h3 className="text-lg font-bold text-gray-700 mb-4">Agregar Nuevo Cosmético</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="text" placeholder="Nombre del producto" className="px-4 py-2 border rounded-lg focus:outline-pink-500" />
          <input type="number" placeholder="Precio ($)" className="px-4 py-2 border rounded-lg focus:outline-pink-500" />
          <input type="text" placeholder="Categoría" className="px-4 py-2 border rounded-lg focus:outline-pink-500" />
          <button className="bg-gray-900 text-white font-semibold py-2 rounded-lg hover:bg-gray-800">Dar de Alta</button>
        </div>
      </div>

      {/* Tabla de Modificaciones */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 font-semibold text-sm border-b">
              <th className="p-4">Producto</th>
              <th className="p-4">Precio Actual</th>
              <th className="p-4">Stock</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-bold text-gray-800">{p.name}</td>
                <td className="p-4">
                  <input 
                    type="number" 
                    value={p.price} 
                    onChange={(e) => handlePriceChange(p._id, e.target.value)}
                    className="w-24 px-2 py-1 border rounded focus:ring-1 focus:ring-pink-400"
                  />
                </td>
                <td className="p-4 text-gray-600">{p.stock} un.</td>
                <td className="p-4 text-center">
                  <button className="text-red-500 font-medium hover:underline" onClick={() => alert('Producto dado de baja temporal')}>Dar de Baja</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}