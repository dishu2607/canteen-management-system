import React, { useEffect, useState } from 'react';
import API from '../api';

export default function MenuPage({ onAdd }) {
  const [menu, setMenu] = useState([]);
  useEffect(()=> {
    API.get('/menu').then(r=>setMenu(r.data)).catch(console.error);
  }, []);
  return (
    <div>
      <h2>Menu</h2>
      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16}}>
        {menu.map(item=>(
          <div key={item.item_id} style={{border:'1px solid #ddd', padding:12}}>
            <h4>{item.name}</h4>
            <p>₹{item.price}</p>
            <p>Stock: {item.stock}</p>
            <button onClick={()=>onAdd({ item_id: item.item_id, name: item.name, qty:1})}>Add to cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}
