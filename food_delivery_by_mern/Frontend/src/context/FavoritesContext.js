// context/FavoritesContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [favoriteCount, setFavoriteCount] = useState(0);

  // Load favorites from localStorage on initial render
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(savedFavorites);
    setFavoriteCount(savedFavorites.length);
  }, []);

  const updateFavorites = (newFavorites) => {
    setFavorites(newFavorites);
    setFavoriteCount(newFavorites.length);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, favoriteCount, updateFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);