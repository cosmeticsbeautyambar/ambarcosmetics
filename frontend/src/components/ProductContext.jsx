import React, { createContext, useState, useEffect } from 'react';

export const ProductContext = createContext();

// Catálogo inicial vacío para ingresar productos reales desde el Panel
const INITIAL_PRODUCTS = [];

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('ambar_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('ambar_products', JSON.stringify(products));
  }, [products]);

  // Agregar nuevo producto desde el panel de la dueña
  const addProduct = (newProduct) => {
    const createdProduct = {
      ...newProduct,
      _id: Date.now().toString(),
      priceRetail: Number(newProduct.priceRetail),
      priceWholesale: Number(newProduct.priceWholesale),
      minWholesaleQty: Number(newProduct.minWholesaleQty || 1),
      stock: Number(newProduct.stock)
    };
    setProducts((prev) => [createdProduct, ...prev]);
  };

  // Actualizar stock directamente en vivo
  const updateStock = (id, newStock) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, stock: Math.max(0, Number(newStock)) } : p))
    );
  };

  // Actualizar precios directamente
  const updatePrices = (id, priceRetail, priceWholesale) => {
    setProducts((prev) =>
      prev.map((p) =>
        p._id === id
          ? { ...p, priceRetail: Number(priceRetail), priceWholesale: Number(priceWholesale) }
          : p
      )
    );
  };

  // Eliminar producto del catálogo
  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  // Descontar stock al realizar una venta
  const reduceStockOnSale = (id, qty = 1) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, stock: Math.max(0, p.stock - qty) } : p))
    );
  };

  return (
    <ProductContext.Provider
      value={{
        products,
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