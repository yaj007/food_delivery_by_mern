import React, { createContext, useState, useContext } from 'react';

// Create a Cart Context
const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems((prevCart) => {
      const itemExists = prevCart.find(cartItem => cartItem._id === item._id);
      if (itemExists) {
        return prevCart.map(cartItem =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevCart) => prevCart.filter(item => item._id !== itemId));
  };

  const updateQuantity = (itemId, action) => {
    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item._id === itemId
          ? { ...item, quantity: action === 'increment' ? item.quantity + 1 : item.quantity - 1 }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
