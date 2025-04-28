import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl text-red-500">Your cart is empty!</p>
      </div>
    );
  }

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountedTotal = total - (total * (discount / 100));

  const handlePromoCodeSubmit = () => {
    const validPromoCodes = {
      "SAVE10": 10,
      "SAVE20": 20,
      "FREESHIP": 5
    };

    if (validPromoCodes[promoCode]) {
      setDiscount(validPromoCodes[promoCode]);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code');
      setDiscount(0);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Your Cart</h2>

      <div>
        {cartItems.map((item) => (
          <div key={item._id} className="flex justify-between items-center mb-4 bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center">
              <img
                src={item.image || 'https://via.placeholder.com/150'}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-teal-400">{item.name}</h3>
                <p className="text-sm text-gray-300">{item.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => updateQuantity(item._id, 'decrement')}
                className="px-2 py-1 bg-teal-600 text-white rounded-full"
              >
                -
              </button>
              <span className="text-xl font-semibold text-white">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item._id, 'increment')}
                className="px-2 py-1 bg-teal-600 text-white rounded-full"
              >
                +
              </button>
              <span className="text-xl">${(item.price * item.quantity).toFixed(2)}</span>
              <button
                onClick={() => removeFromCart(item._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-full"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <label htmlFor="promoCode" className="text-lg font-semibold">Have a promo code?</label>
        <div className="flex items-center gap-2 mt-2">
          <input
            type="text"
            id="promoCode"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="p-2 rounded-lg bg-gray-700 text-white"
            placeholder="Enter promo code"
          />
          <button
            onClick={handlePromoCodeSubmit}
            className="px-4 py-2 bg-teal-600 text-white rounded-full"
          >
            Apply
          </button>
        </div>
        {promoError && <p className="text-red-500 mt-2">{promoError}</p>}
      </div>

      <div className="flex justify-between items-center mt-4">
        <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
        {discount > 0 && (
          <p className="text-lg text-green-500">Discount: -${(total * (discount / 100)).toFixed(2)}</p>
        )}
      </div>
      <div className="flex justify-between items-center mt-4">
        <p className="text-xl font-bold">Total After Discount: ${discountedTotal.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default Cart;
