import React, { useState } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';

function ReviewForm({ foodItemId, onReviewAdded }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (!comment.trim()) {
      setError('Please enter a comment');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to leave a review');
        return;
      }
      
      const response = await axios.post('http://localhost:3001/reviews', {
        foodItemId,
        rating,
        comment
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Reset form
      setRating(0);
      setComment('');
      
      // Notify parent component
      if (onReviewAdded) {
        onReviewAdded(response.data.review);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setError(error.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 dark:bg-white rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-600/20 text-red-500 rounded-lg">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Rating</label>
          <div className="flex">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <label key={index} className="cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    value={ratingValue}
                    onClick={() => setRating(ratingValue)}
                    className="hidden"
                  />
                  <FaStar
                    className="mr-1 text-2xl"
                    color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(0)}
                  />
                </label>
              );
            })}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2" htmlFor="comment">
            Comment
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-3 bg-gray-700 dark:bg-gray-200 rounded-lg"
            rows="4"
            placeholder="Share your experience with this item..."
          ></textarea>
        </div>
        
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}

export default ReviewForm;