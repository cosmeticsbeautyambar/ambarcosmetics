import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cartItems');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Agregar al carrito
  const addToCart = (product, qty = 1) => {
    setCartItems((prevItems) => {
      const exists = prevItems.find((x) => x._id === product._id);
      
      // Normalizar precio por si viene como priceRetail o price
      const actualPrice = product.priceRetail || product.price || 0;
      const cleanProduct = { ...product, price: actualPrice };

      if (exists) {
        return prevItems.map((x) =>
          x._id === product._id ? { ...exists, qty: exists.qty + qty } : x
        );
      }
      return [...prevItems, { ...cleanProduct, qty }];
    });
  };

  // Actualizar cantidad específica
  const updateQuantity = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item._id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : item;
          }
          return item;
        })
        .filter((item) => item.qty > 0)
    );
  };

  // Eliminar producto
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((x) => x._id !== id));
  };

  // Vaciar carrito
  const clearCart = () => setCartItems([]);

  // CÁLCULOS DE MONTO
  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + (item.price || item.priceRetail || 0) * item.qty,
    0
  );

  // Descuento automático si superas los $50.000
  const aplicaDescuento = cartSubtotal >= 50000;
  const cartDiscount = aplicaDescuento ? cartSubtotal * 0.10 : 0;
  const cartTotal = cartSubtotal - cartDiscount;

  // Contador total de unidades para el badge del nav
  const totalCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartDiscount,
        cartTotal,
        totalCount,
        aplicaDescuento
      }}
    >
      {children}
    </CartContext.Provider>
  );
};