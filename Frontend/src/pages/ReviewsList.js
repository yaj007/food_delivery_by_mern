import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaUser } from 'react-icons/fa';

function ReviewsList({ foodItemId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, [foodItemId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3001/reviews/food/${foodItemId}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
      
      {loading ? (
        <div className="flex justify-center items-center h-24">
          <p>Loading reviews...</p>
        </div>
      ) : error ? (
        <div className="text-red-500 mb-4">{error}</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-6 bg-gray-700 dark:bg-gray-200 rounded-lg">
          <p>No reviews yet. Be the first to review this item!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review._id} className="bg-gray-700 dark:bg-gray-200 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="bg-gray-600 dark:bg-gray-300 p-2 rounded-full mr-3">
                    <FaUser className="text-gray-300 dark:text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">{review.userId.fullName}</p>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, index) => (
                        <FaStar
                          key={index}
                          className="mr-1"
                          color={index < review.rating ? "#ffc107" : "#e4e5e9"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-400 dark:text-gray-500">
                  {formatDate(review.createdAt)}
                </span>
              </div>
              <p className="mt-3 text-gray-300 dark:text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewsList;
