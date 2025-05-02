import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Updated import

const PaymentPage = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [paymentError, setPaymentError] = useState('');

  const { clearCart } = useCart(); // Use custom hook
  const navigate = useNavigate();

  const handlePayment = () => {
    if (!cardNumber || !expiry || !cvv || !cardHolder) {
      setPaymentError("Please fill out all payment fields.");
      return;
    }

    const generatedOrderId = Math.floor(Math.random() * 1000000);

    alert("Payment Successful! Your order has been placed.");
    clearCart();
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setCardHolder('');
    setPaymentError('');

    navigate(`/track-order/${generatedOrderId}`);
  };

  return (
    <div>
      <h2>Payment Page</h2>
      <input
        type="text"
        placeholder="Card Number"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
      />
      <input
        type="text"
        placeholder="Expiry Date"
        value={expiry}
        onChange={(e) => setExpiry(e.target.value)}
      />
      <input
        type="text"
        placeholder="CVV"
        value={cvv}
        onChange={(e) => setCvv(e.target.value)}
      />
      <input
        type="text"
        placeholder="Card Holder Name"
        value={cardHolder}
        onChange={(e) => setCardHolder(e.target.value)}
      />
      {paymentError && <p style={{ color: 'red' }}>{paymentError}</p>}
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default PaymentPage;
