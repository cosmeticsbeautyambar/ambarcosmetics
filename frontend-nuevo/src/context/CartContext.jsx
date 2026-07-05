import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(JSON.parse(localStorage.getItem('cartItems')) || []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    const exists = cartItems.find(x => x._id === product._id);
    if (exists) {
      setCartItems(cartItems.map(x => x._id === product._id ? { ...exists, qty: exists.qty + qty } : x));
    } else {
      setCartItems([...cartItems, { ...product, qty }]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(x => x._id !== id));
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};