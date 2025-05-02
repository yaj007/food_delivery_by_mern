import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';  // Import the CartProvider

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <CartProvider>  {/* Wrap App with CartProvider to provide cart state globally */}
      <App />
    </CartProvider>
  </BrowserRouter>
);
