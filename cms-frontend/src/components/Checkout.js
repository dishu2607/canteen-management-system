import React from 'react';
import API from '../api';

export default function Checkout({ user_id, cart, onSuccess }) {
  const handlePayment = async () => {
    // map cart to minimal structure
    const payload = {
      user_id,
      cart: cart.map(i=>({ item_id: i.item_id, qty: i.qty })),
      paymentMethod: 'Wallet' // or UPI/Card
    };
    try {
      const { data } = await API.post('/orders', payload);
      alert('Order placed. Order id: ' + data.order_id);
      onSuccess(data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || err.message);
    }
  };
  return (
    <div>
      <h3>Checkout</h3>
      <button onClick={handlePayment}>Pay with Wallet</button>
    </div>
  );
}
