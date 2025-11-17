import React, { useState, useEffect } from 'react';
import API from '../api';

export default function AdminInventory() {
  const [inv, setInv] = useState([]);
  useEffect(()=>{ API.get('/inventory').then(r=>setInv(r.data)); }, []);
  const updateQty = async (itemId, newQty) => {
    await API.put(`/inventory/${itemId}`, { quantity: newQty });
    const { data } = await API.get('/inventory'); setInv(data);
  };
  return (
    <div>
      <h3>Inventory</h3>
      {inv.map(row=>(
        <div key={row.inventory_id} style={{border:'1px solid #ddd', padding:8, margin:8}}>
          <b>{row.menu_items.name}</b> - Qty: {row.quantity}
          <button onClick={()=>updateQty(row.menu_items.item_id, row.quantity - 1)}>-</button>
          <button onClick={()=>updateQty(row.menu_items.item_id, row.quantity + 1)}>+</button>
        </div>
      ))}
    </div>
  );
}
