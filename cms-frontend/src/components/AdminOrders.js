import React, { useState, useEffect } from 'react';
import API from '../api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  useEffect(()=>{ API.get('/admin/orders').then(r=>setOrders(r.data)); }, []);
  const update = async (orderId, status) => {
    await API.patch(`/admin/orders/${orderId}`, { status });
    const { data } = await API.get('/admin/orders'); setOrders(data);
  };
  return (
    <div>
      <h3>Admin Orders</h3>
      {orders.map(o=>(
        <div key={o.order_id} style={{border:'1px solid #ddd', padding:8, margin:8}}>
          <div>Order: {o.order_id} - Status: {o.status}</div>
          <div>Items:
            {o.order_items.map(oi=>(
              <div key={oi.item_id}>{oi.menu_items?.name} × {oi.quantity}</div>
            ))}
          </div>
          <button onClick={()=>update(o.order_id, 'completed')}>Complete</button>
          <button onClick={()=>update(o.order_id, 'cancelled')}>Cancel</button>
        </div>
      ))}
    </div>
  );
}
