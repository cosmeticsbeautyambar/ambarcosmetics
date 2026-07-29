import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const ProductContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  // Cargar productos desde MongoDB al iniciar
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error al obtener productos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Agregar nuevo producto (Requiere Token de la Dueña)
  const addProduct = async (newProduct) => {
    if (!user || !user.token) return;

    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          ...newProduct,
          priceRetail: Number(newProduct.priceRetail),
          priceWholesale: Number(newProduct.priceWholesale),
          minWholesaleQty: Number(newProduct.minWholesaleQty || 1),
          stock: Number(newProduct.stock)
        })
      });

      if (res.ok) {
        const createdProduct = await res.json();
        setProducts((prev) => [createdProduct, ...prev]);
        return { success: true };
      } else {
        const errData = await res.json();
        return { success: false, message: errData.message };
      }
    } catch (error) {
      return { success: false, message: 'Error al conectar con el servidor' };
    }
  };

  // Actualizar stock directamente en vivo en MongoDB
  const updateStock = async (id, newStock) => {
    if (!user || !user.token) return;

    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ stock: Math.max(0, Number(newStock)) })
      });

      if (res.ok) {
        const updated = await res.json();
        setProducts((prev) => prev.map((p) => (p._id === id ? updated : p)));
      }
    } catch (error) {
      console.error('Error al actualizar stock:', error);
    }
  };

  // Actualizar precios directamente en MongoDB
  const updatePrices = async (id, priceRetail, priceWholesale) => {
    if (!user || !user.token) return;

    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          priceRetail: Number(priceRetail),
          priceWholesale: Number(priceWholesale)
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setProducts((prev) => prev.map((p) => (p._id === id ? updated : p)));
      }
    } catch (error) {
      console.error('Error al actualizar precios:', error);
    }
  };

  // Eliminar producto del catálogo en MongoDB
  const deleteProduct = async (id) => {
    if (!user || !user.token) return;

    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  // Descontar stock local/remoto al vender
  const reduceStockOnSale = async (id, qty = 1) => {
    const target = products.find((p) => p._id === id);
    if (!target) return;
    const newStock = Math.max(0, target.stock - qty);
    await updateStock(id, newStock);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        fetchProducts,
        addProduct,
        updateStock,
        updatePrices,
        deleteProduct,
        reduceStockOnSale
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}