// // Wishlist.js (Page Component)
// import React from 'react';
// import { useWishlist } from '../context/WishlistContext';
// import { useCart } from '../context/CartContext';
// import { FaShoppingCart, FaTrash } from 'react-icons/fa';

// function Wishlist() {
//   const { wishlistItems, loading, removeFromWishlist } = useWishlist();
//   const { addToCart } = useCart();
//   const [showRequestForm, setShowRequestForm] = useState(false);
//   const [requestData, setRequestData] = useState({
//     name: '',
//     description: '',
//     category: ''
//   });
//   const [requestStatus, setRequestStatus] = useState(null);
//   const [userRequests, setUserRequests] = useState([]);

//   const handleAddToCart = (item) => {
//     addToCart(item);
//     // Optionally remove from wishlist after adding to cart
//     // removeFromWishlist(item._id);
//   };
//   useEffect(() => {
//     if (localStorage.getItem('token')) {
//       fetchUserRequests();
//     }
//   }, []);
  
//   const fetchUserRequests = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get('http://localhost:3001/item-requests/user', {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       setUserRequests(response.data);
//     } catch (error) {
//       console.error('Error fetching user requests:', error);
//     }
//   };
  
//   const handleRequestChange = (e) => {
//     const { name, value } = e.target;
//     setRequestData({
//       ...requestData,
//       [name]: value
//     });
//   };
  
//   const submitItemRequest = async (e) => {
//     e.preventDefault();
    
//     try {
//       const token = localStorage.getItem('token');
      
//       await axios.post('http://localhost:3001/item-requests', requestData, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
      
//       setRequestStatus({
//         type: 'success',
//         message: 'Your request has been submitted! Our team will review it soon.'
//       });
      
//       // Reset form
//       setRequestData({
//         name: '',
//         description: '',
//         category: ''
//       });
      
//       // Refresh user requests
//       fetchUserRequests();
      
//       // Hide form after success
//       setTimeout(() => {
//         setShowRequestForm(false);
//         setRequestStatus(null);
//       }, 3000);
      
//     } catch (error) {
//       console.error('Error submitting item request:', error);
//       setRequestStatus({
//         type: 'error',
//         message: 'Failed to submit your request. Please try again.'
//       });
//     }
//   };

//   return (
//     <div className="w-full min-h-screen bg-[#1a1a1a] dark:bg-gray-100 text-white dark:text-gray-800 p-6 transition-colors duration-300">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-4xl font-bold text-center text-teal-400 dark:text-teal-600 mb-6">My Wishlist</h1>

//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <p className="text-xl">Loading wishlist...</p>
//           </div>
//         ) : wishlistItems.length === 0 ? (
//           <div className="flex flex-col justify-center items-center h-64">
//             <p className="text-xl mb-4">Your wishlist is empty</p>
//             <a href="/" className="bg-teal-600 text-white py-2 px-6 rounded-full">
//               Browse Menu
//             </a>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {wishlistItems.map(item => (
//               <div
//                 key={item._id}
//                 className="bg-gray-800 dark:bg-white rounded-lg overflow-hidden shadow-lg"
//               >
//                 <img
//                   src={item.image || 'https://via.placeholder.com/300x200'}
//                   alt={item.name}
//                   className="w-full h-48 object-cover"
//                 />
//                 <div className="p-4">
//                   <div className="flex justify-between items-start">
//                     <h3 className="text-xl font-semibold text-teal-400 dark:text-teal-600">{item.name}</h3>
//                     <span className="bg-teal-600 text-white px-2 py-1 rounded-full text-sm">
//                       ${item.price.toFixed(2)}
//                     </span>
//                   </div>
//                   <span className="inline-block bg-gray-700 dark:bg-gray-200 text-gray-300 dark:text-gray-800 rounded-full px-3 py-1 text-xs mt-2">
//                     {item.category}
//                   </span>
//                   <p className="mt-2 text-gray-300 dark:text-gray-600">{item.description}</p>

//                   <div className="flex mt-4 gap-2">
//                     <button
//                       onClick={() => handleAddToCart(item)}
//                       className="flex-1 bg-teal-600 text-white py-2 rounded-full transition-colors hover:bg-teal-700 flex items-center justify-center"
//                     >
//                       <FaShoppingCart className="mr-2" /> Add to Cart
//                     </button>
//                     <button
//                       onClick={() => removeFromWishlist(item._id)}
//                       className="p-2 bg-red-600 text-white rounded-full transition-colors hover:bg-red-700"
//                     >
//                       <FaTrash />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
    
    
//   );
// }

// export default Wishlist;
// Wishlist.js (Page Component)
import React, { useState, useEffect } from 'react'; // Added missing imports
import axios from 'axios'; // Added missing import
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaTrash } from 'react-icons/fa';

function Wishlist() {
  const { wishlistItems, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestData, setRequestData] = useState({
    name: '',
    description: '',
    category: ''
  });
  const [requestStatus, setRequestStatus] = useState(null);
  const [userRequests, setUserRequests] = useState([]);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      fetchUserRequests();
    }
  }, []);

  const handleAddToCart = (item) => {
    addToCart(item);
    // Optionally remove from wishlist after adding to cart
    // removeFromWishlist(item._id);
  };
  
  const fetchUserRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/item-requests/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserRequests(response.data);
    } catch (error) {
      console.error('Error fetching user requests:', error);
    }
  };
  
  const handleRequestChange = (e) => {
    const { name, value } = e.target;
    setRequestData({
      ...requestData,
      [name]: value
    });
  };
  
  const submitItemRequest = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      
      await axios.post('http://localhost:3001/item-requests', requestData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setRequestStatus({
        type: 'success',
        message: 'Your request has been submitted! Our team will review it soon.'
      });
      
      // Reset form
      setRequestData({
        name: '',
        description: '',
        category: ''
      });
      
      // Refresh user requests
      fetchUserRequests();
      
      // Hide form after success
      setTimeout(() => {
        setShowRequestForm(false);
        setRequestStatus(null);
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting item request:', error);
      setRequestStatus({
        type: 'error',
        message: 'Failed to submit your request. Please try again.'
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#1a1a1a] dark:bg-gray-100 text-white dark:text-gray-800 p-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-teal-400 dark:text-teal-600 mb-6">My Wishlist</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">Loading wishlist...</p>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64">
            <p className="text-xl mb-4">Your wishlist is empty</p>
            <a href="/" className="bg-teal-600 text-white py-2 px-6 rounded-full">
              Browse Menu
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map(item => (
              <div
                key={item._id}
                className="bg-gray-800 dark:bg-white rounded-lg overflow-hidden shadow-lg"
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

                  <div className="flex mt-4 gap-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 bg-teal-600 text-white py-2 rounded-full transition-colors hover:bg-teal-700 flex items-center justify-center"
                    >
                      <FaShoppingCart className="mr-2" /> Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item._id)}
                      className="p-2 bg-red-600 text-white rounded-full transition-colors hover:bg-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Request New Items Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-teal-400 dark:text-teal-600">Request New Items</h2>
            <button
              onClick={() => setShowRequestForm(!showRequestForm)}
              className="bg-teal-600 text-white py-2 px-4 rounded-lg"
            >
              {showRequestForm ? 'Cancel' : 'Request an Item'}
            </button>
          </div>
          
          {showRequestForm && (
            <div className="bg-gray-800 dark:bg-white p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold mb-4">Submit Your Request</h3>
              
              {requestStatus && (
                <div className={`mb-4 p-3 rounded-lg ${
                  requestStatus.type === 'success' 
                    ? 'bg-green-600/20 text-green-500' 
                    : 'bg-red-600/20 text-red-500'
                }`}>
                  {requestStatus.message}
                </div>
              )}
              
              <form onSubmit={submitItemRequest}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Item Name</label>
                  <input
                    type="text"
                    name="name"
                    value={requestData.name}
                    onChange={handleRequestChange}
                    className="w-full p-2 bg-gray-700 dark:bg-gray-200 rounded-lg"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    name="category"
                    value={requestData.category}
                    onChange={handleRequestChange}
                    className="w-full p-2 bg-gray-700 dark:bg-gray-200 rounded-lg"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Appetizer">Appetizer</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Beverage">Beverage</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    value={requestData.description}
                    onChange={handleRequestChange}
                    className="w-full p-2 bg-gray-700 dark:bg-gray-200 rounded-lg"
                    rows="3"
                    placeholder="Tell us about the item you'd like to see on our menu..."
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg"
                >
                  Submit Request
                </button>
              </form>
            </div>
          )}
          
          {userRequests.length > 0 && (
            <div className="bg-gray-800 dark:bg-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Your Previous Requests</h3>
              <div className="space-y-4">
                {userRequests.map(request => (
                  <div key={request._id} className="bg-gray-700 dark:bg-gray-200 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-teal-400 dark:text-teal-600">{request.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        request.status === 'Approved' ? 'bg-green-600 text-white' :
                        request.status === 'Rejected' ? 'bg-red-600 text-white' :
                        'bg-yellow-600 text-white'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 dark:text-gray-600 mt-1">{request.category}</p>
                    <p className="mt-2">{request.description}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Submitted on {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Wishlist;