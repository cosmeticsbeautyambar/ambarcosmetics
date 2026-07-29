import React, { createContext, useState, useEffect } from 'react';

export const ProductContext = createContext();

// Productos iniciales de prueba con doble precio y stock
const INITIAL_PRODUCTS = [
  {
    _id: '1',
    name: 'Body Splash con Glitter',
    description: 'Aporta un brillo sutil deslumbrante y una fragancia envolvente de larga duración.',
    category: 'Corporales',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600',
    priceRetail: 8500,       // Precio Minorista
    priceWholesale: 5200,    // Precio Mayorista
    minWholesaleQty: 6,      // Mínimo de compra por mayor
    stock: 20
  },
  {
    _id: '2',
    name: 'Sérum Facial Hidratante',
    description: 'Fórmula ligera concentrada con ácido hialurónico para devolver la luminosidad natural.',
    category: 'Faciales',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600',
    priceRetail: 12000,
    priceWholesale: 7800,
    minWholesaleQty: 3,
    stock: 12
  },
  {
    _id: '3',
    name: 'Aceite Capilar Reparador',
    description: 'Nutrición intensa para puntas abiertas sin dejar sensación pesada.',
    category: 'Capilares',
    image: 'https://images.unsplash.com/photo-1608248597261-e4d3513a967d?w=600',
    priceRetail: 9800,
    priceWholesale: 6100,
    minWholesaleQty: 5,
    stock: 5
  }
];

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('ambar_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('ambar_products', JSON.stringify(products));
  }, [products]);

  // Agregar nuevo producto desde el panel
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

  // Actualizar stock directamente
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

  // Eliminar producto
  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  // Simular descuento de stock tras una venta
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