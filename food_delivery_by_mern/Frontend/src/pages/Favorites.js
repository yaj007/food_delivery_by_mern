import React from 'react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useNavigate } from 'react-router-dom';

function Favorites() {
  const { favorites, updateFavorites } = useFavorites(); // Get from context
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (item) => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    } else {
      addToCart(item);
    }
  };

  const handleBuyNow = (item) => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    } else {
      addToCart(item);
      navigate('/cart');
    }
  };

  const handleRemoveFromFavorites = (item) => {
    const updatedFavorites = favorites.filter(fav => fav._id !== item._id);
    updateFavorites(updatedFavorites); // This will update both favorites and the count
  };

  return (
    <div className="w-full min-h-screen bg-[#1a1a1a] dark:bg-gray-100 text-white dark:text-gray-800 p-6">
      <h1 className="text-4xl font-bold text-center text-teal-400 dark:text-teal-600 mb-6">
        Your Favorites ({favorites.length})
      </h1>

      {favorites.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">You have no favorite items yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((item) => (
            <div key={item._id} className="bg-gray-800 dark:bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
              <img
                src={item.image || 'https://via.placeholder.com/300x200'}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-teal-400 dark:text-teal-600">{item.name}</h3>
                  <span className="bg-teal-600 text-white px-2 py-1 rounded-full text-sm">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
                <span className="inline-block bg-gray-700 dark:bg-gray-200 text-gray-300 dark:text-gray-800 rounded-full px-3 py-1 text-xs mt-2">
                  {item.category}
                </span>
                <p className="mt-2 text-gray-300 dark:text-gray-600">{item.description}</p>

                <button
                  onClick={() => handleAddToCart(item)}
                  className="mt-4 w-full bg-teal-600 text-white py-2 rounded-full transition-colors hover:bg-teal-700"
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => handleBuyNow(item)}
                  className="mt-4 w-full bg-yellow-600 text-white py-2 rounded-full transition-colors hover:bg-yellow-700"
                >
                  Buy Now
                </button>

                <button
                  onClick={() => handleRemoveFromFavorites(item)}
                  className="mt-4 w-full bg-red-600 text-white py-2 rounded-full transition-colors hover:bg-red-700"
                >
                  Remove from Favorites
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;