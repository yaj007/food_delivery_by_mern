// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import AdminDashboard from './pages/AdminDashboard';
import Cart from './pages/Cart';
import { CartProvider } from './context/CartContext';
import Favorites from './pages/Favorites';
import { FavoritesProvider } from './context/FavoritesContext';

function App() {
  const isUserSignedIn = !!localStorage.getItem('token');

  return (
    <CartProvider>
      <FavoritesProvider>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
            {isUserSignedIn && <Route path='/profile' element={<Profile />} />}
            {isUserSignedIn && <Route path='/change-password' element={<ChangePassword />} />}
            {isUserSignedIn && <Route path='/admin' element={<AdminDashboard />} />}
            {isUserSignedIn && <Route path='/cart' element={<Cart />} />}
            {isUserSignedIn && <Route path="/favorites" element={<Favorites />} />}
          </Routes>
        </div>
      </FavoritesProvider>
    </CartProvider>
  );
}

export default App;