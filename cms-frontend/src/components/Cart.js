import React from 'react';

export default function Cart({ cart, setCart, onCheckout }) {
  const inc = (idx)=> {
    const c = [...cart]; c[idx].qty++; setCart(c);
  };
  const dec = (idx)=> {
    const c = [...cart]; if (c[idx].qty>1) c[idx].qty--; setCart(c);
  };
  const remove = (idx)=> { const c=[...cart]; c.splice(idx,1); setCart(c); };
  const total = cart.reduce((s,i)=> s + (i.qty * (i.price || 0)),0);
  return (
    <div>
      <h3>Your Cart</h3>
      {cart.map((it, idx)=>(
        <div key={idx}>
          <b>{it.name}</b> - {it.qty}
          <button onClick={()=>dec(idx)}>-</button>
          <button onClick={()=>inc(idx)}>+</button>
          <button onClick={()=>remove(idx)}>x</button>
        </div>
      ))}
      <div>Total: ₹{total}</div>
      <button onClick={()=>onCheckout()}>Proceed to Checkout</button>
    </div>
  );
}
