// OrderHistory.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaBox, FaSpinner, FaCheck, FaTruck, FaTimes } from 'react-icons/fa';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('http://localhost:3001/orders/history', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching order history:', error);
      setError('Failed to fetch order history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <FaSpinner className="text-yellow-500" />;
      case 'Processing':
        return <FaBox className="text-blue-500" />;
      case 'Delivered':
        return <FaCheck className="text-green-500" />;
      case 'Cancelled':
        return <FaTimes className="text-red-500" />;
      default:
        return <FaTruck className="text-teal-500" />;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="w-full min-h-screen bg-[#1a1a1a] dark:bg-gray-100 text-white dark:text-gray-800 p-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-teal-400 dark:text-teal-600 mb-6">Order History</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center mb-4">{error}</div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64">
            <p className="text-xl mb-4">You haven't placed any orders yet</p>
            <Link to="/" className="bg-teal-600 text-white py-2 px-6 rounded-full">
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order._id} className="bg-gray-800 dark:bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="p-4 bg-gray-700 dark:bg-gray-200 flex justify-between items-center">
                  <div>
                    <span className="text-sm text-gray-300 dark:text-gray-600">Order ID: {order._id}</span>
                    <p className="text-sm text-gray-300 dark:text-gray-600">
                      Placed on: {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {getStatusIcon(order.status)}
                    <span className="ml-2 font-semibold">{order.status}</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Items</h3>
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700 dark:border-gray-300">
                        <div className="flex items-center">
                          <img
                            src={item.foodItem.image || 'https://via.placeholder.com/50'}
                            alt={item.foodItem.name}
                            className="w-12 h-12 object-cover rounded-md mr-3"
                          />
                          <div>
                            <p className="font-medium">{item.foodItem.name}</p>
                            <p className="text-sm text-gray-400 dark:text-gray-600">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-teal-400 dark:text-teal-600">${order.totalAmount.toFixed(2)}</span>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-700 dark:border-gray-300">
                    <h3 className="text-lg font-semibold mb-2">Delivery Address</h3>
                    <p>
                      {order.deliveryAddress.houseNo}, {order.deliveryAddress.area}, {order.deliveryAddress.city}
                    </p>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
                    <p>{order.paymentMethod}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistory;