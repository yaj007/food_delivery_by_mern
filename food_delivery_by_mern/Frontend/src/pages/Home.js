import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceSort, setPriceSort] = useState('');

  const { addToCart } = useCart();
  const { favorites, updateFavorites } = useFavorites();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFoodItems();
  }, [selectedCategory, priceSort]);

  const fetchFoodItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/food-items', {
        params: {
          category: selectedCategory,
          priceSort: priceSort,
        },
      });
      setFoodItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching food items:', error);
      setError('Failed to fetch food items');
      setLoading(false);
    }
  };

  const categories = ['All', 'Appetizer', 'Main Course', 'Dessert', 'Beverage'];

  const filteredItems = foodItems.filter(item => {
    const isCategoryMatch = selectedCategory === 'All' || item.category === selectedCategory;
    const isSearchMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return isCategoryMatch && isSearchMatch;
  });

  const handlePriceSort = (e) => {
    setPriceSort(e.target.value);
  };

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

  const handleToggleFavorite = (item) => {
    let updatedFavorites;
    if (favorites.some(fav => fav._id === item._id)) {
      updatedFavorites = favorites.filter(fav => fav._id !== item._id);
    } else {
      updatedFavorites = [...favorites, item];
    }
    updateFavorites(updatedFavorites);
  };

  return (
    <div className="w-full min-h-screen bg-[#1a1a1a] dark:bg-gray-100 text-white dark:text-gray-800 p-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center items-center mb-8">
          <h1 className="text-4xl font-bold text-center text-teal-400 dark:text-teal-600">TastyTracks Menu</h1>
        </div>

        <div className="flex justify-center mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for food..."
            className="p-2 rounded-full bg-gray-800 dark:bg-gray-300 text-gray-300 dark:text-gray-800 placeholder-gray-500 w-full max-w-md"
          />
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full transition-colors ${selectedCategory === category
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-800 dark:bg-gray-300 text-gray-300 dark:text-gray-800 hover:bg-gray-700 dark:hover:bg-gray-400'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <select 
            value={priceSort} 
            onChange={handlePriceSort} 
            className="px-4 py-2 rounded-md bg-gray-800 dark:bg-gray-300 text-gray-300 dark:text-gray-800"
          >
            <option value="">Sort by Price</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">Loading menu items...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-red-500">{error}</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">No items found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <div
                key={item._id}
                className="bg-gray-800 dark:bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105"
              >
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
                    onClick={() => handleToggleFavorite(item)}
                    className={`mt-4 w-full py-2 rounded-full transition-colors ${
                      favorites.some(fav => fav._id === item._id)
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 dark:bg-gray-200 dark:text-gray-800 dark:hover:bg-gray-300'
                    }`}
                  >
                    {favorites.some(fav => fav._id === item._id) ? 'Remove from Favorites' : 'Add to Favorites'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;