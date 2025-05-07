// src/pages/FoodItemDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import ReviewForm from './ReviewForm';
import ReviewsList from './ReviewsList';

function FoodItemDetail() {
  const { id } = useParams();
  const [foodItem, setFoodItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchFoodItem();
  }, [id]);
  
  const fetchFoodItem = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3001/food-items/${id}`);
      setFoodItem(response.data);
    } catch (error) {
      console.error('Error fetching food item:', error);
      setError('Failed to load food item details');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddToCart = () => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    } else {
      addToCart(foodItem);
    }
  };
  
  const handleBuyNow = () => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    } else {
      addToCart(foodItem);
      navigate('/cart');
    }
  };
  
  const handleReviewAdded = () => {
    // Refresh food item data to get updated rating
    fetchFoodItem();
  };
  
  if (loading) return <div className="flex justify-center items-center h-64"><p>Loading...</p></div>;
  if (error) return <div className="flex justify-center items-center h-64 text-red-500"><p>{error}</p></div>;
  if (!foodItem) return <div className="flex justify-center items-center h-64"><p>Food item not found</p></div>;
  
  return (
    <div className="w-full min-h-screen bg-[#1a1a1a] dark:bg-gray-100 text-white dark:text-gray-800 p-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 dark:bg-white rounded-lg overflow-hidden shadow-lg">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={foodItem.image || 'https://via.placeholder.com/400x300'}
                alt={foodItem.name}
                className="w-full h-64 md:h-auto object-cover"
              />
            </div>
            <div className="p-6 md:w-1/2">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-teal-400 dark:text-teal-600">{foodItem.name}</h1>
                <span className="bg-teal-600 text-white px-3 py-1 rounded-full text-xl">
                  ${foodItem.price.toFixed(2)}
                </span>
              </div>
              <span className="inline-block bg-gray-700 dark:bg-gray-200 text-gray-300 dark:text-gray-800 rounded-full px-3 py-1 text-sm mt-2">
                {foodItem.category}
              </span>
              
              <div className="flex items-center mt-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < Math.round(foodItem.rating) ? 'text-yellow-400' : 'text-gray-500'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-gray-400">({foodItem.rating.toFixed(1)})</span>
              </div>
              
              <p className="mt-4 text-gray-300 dark:text-gray-600">{foodItem.description}</p>
              
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg transition-colors"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ReviewForm foodItemId={id} onReviewAdded={handleReviewAdded} />
              <ReviewsList foodItemId={id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodItemDetail;