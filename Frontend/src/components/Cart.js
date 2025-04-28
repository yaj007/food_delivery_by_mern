import React from 'react';
import { useCart } from '../context/CartContext'; // Import useCart to access cart functions
import { Link } from 'react-router-dom';

function Cart() {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();

  return (
    <div className="w-full min-h-screen bg-[#1a1a1a] dark:bg-gray-100 text-white dark:text-gray-800 p-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-teal-400 dark:text-teal-600 mb-6">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-6">
            {cartItems.map(item => (
              <div key={item._id} className="flex justify-between items-center bg-gray-800 dark:bg-white rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image || 'https://via.placeholder.com/300x200'}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-teal-400 dark:text-teal-600">{item.name}</h3>
                    <span className="text-sm text-gray-300 dark:text-gray-600">{item.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Decrease Button */}
                  <button
                    onClick={() => decreaseQuantity(item._id)}
                    className="bg-teal-600 text-white px-4 py-2 rounded-full"
                  >
                    -
                  </button>

                  {/* Quantity */}
                  <span className="text-xl">{item.quantity}</span>

                  {/* Increase Button */}
                  <button
                    onClick={() => increaseQuantity(item._id)}
                    className="bg-teal-600 text-white px-4 py-2 rounded-full"
                  >
                    +
                  </button>

                  {/* Remove Item */}
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>

                {/* Price */}
                <span className="text-xl text-teal-600">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            {/* Total Price */}
            <div className="flex justify-end mt-8 text-xl font-bold text-teal-400">
              <span>Total: ${cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</span>
            </div>

            <div className="flex justify-end mt-4">
              <Link to="/checkout" className="bg-teal-600 text-white py-2 px-6 rounded-full">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
