import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // ✅ Import cart context

function Navbar() {
  const isUserSignedIn = !!localStorage.getItem('token');
  const navigate = useNavigate();
  const { cartItems } = useCart(); // ✅ Access cart items from context

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Calculate the total items count in the cart
  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <nav className="flex justify-around p-3 border-b border-zinc-800 items-center bg-[#1a1a1a]/90 text-zinc-300 dark:bg-gray-100 dark:text-gray-800">
      <Link to="/"><h1 className="text-3xl">TastyTracks</h1></Link>

      <div className="flex items-center gap-6">
        <ul className="flex gap-6 items-center">
          {isUserSignedIn ? (
            <>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/change-password">Change Password</Link></li>
              <li><Link to="/admin">Admin</Link></li>
              <li><button onClick={handleSignOut}>Sign Out</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Signup</Link></li>
            </>
          )}

          {/* 🛒 Cart link with item count badge */}
          <li className="relative">
            <Link to="/cart" className="flex items-center">
              Cart
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-3 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  {getTotalCartItems()}
                </span>
              )}
            </Link>
          </li>
        </ul>

        {/* 🌗 Theme toggle button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-800 dark:bg-gray-200"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <span className="text-yellow-300">☀️</span>
          ) : (
            <span className="text-gray-800">🌙</span>
          )}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
