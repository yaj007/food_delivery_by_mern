import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      console.log("Fetching wishlist...");
      const token = localStorage.getItem('token');
      if (!token) {
        setWishlistItems([]);
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:3001/wishlist', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setWishlistItems(response.data.items || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const addToWishlist = async (foodItemId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.post('http://localhost:3001/wishlist/add', {
        foodItemId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      fetchWishlist();
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const removeFromWishlist = async (foodItemId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.delete(`http://localhost:3001/wishlist/remove/${foodItemId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      fetchWishlist();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlistItems, 
      loading, 
      addToWishlist, 
      removeFromWishlist,
      wishlistCount: wishlistItems.length
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
