import React, { useEffect, useState } from "react";
import API from "../../api";
import toast from "react-hot-toast";

export default function AddInventoryPage({ onCreated }) {
  const [menu, setMenu] = useState([]);
  const [itemId, setItemId] = useState("");
  const [qty, setQty] = useState("");
  const [cost, setCost] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMenu = async () => {
    try {
      const res = await API.get("/menu_all");
      setMenu(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch items");
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!itemId) return toast.error("Select item");
    if (qty === "" || isNaN(Number(qty))) return toast.error("Enter valid qty");

    setLoading(true);
    try {
      const payload = { item_id: itemId, quantity: Number(qty), cost_price: cost ? Number(cost) : null };
      const res = await API.post("/inventory", payload);
      toast.success("Inventory added");
      setItemId(""); setQty(""); setCost("");
      if (onCreated) onCreated(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add inventory");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
      <h3 className="text-xl font-semibold mb-4">Add Inventory</h3>

      <form onSubmit={submit} className="space-y-3">
        <select value={itemId} onChange={e=>setItemId(e.target.value)} className="w-full border px-3 py-2 rounded">
          <option value="">Select menu item</option>
          {menu.map(m => <option value={m.item_id} key={m.item_id}>{m.name} — ₹{m.price}</option>)}
        </select>

        <div className="flex gap-3">
          <input type="number" min="0" className="flex-1 border px-3 py-2 rounded" placeholder="Quantity" value={qty} onChange={e=>setQty(e.target.value)} />
          <input type="number" min="0" className="flex-1 border px-3 py-2 rounded" placeholder="Cost Price (optional)" value={cost} onChange={e=>setCost(e.target.value)} />
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? "Saving..." : "Add Inventory"}
        </button>
      </form>
    </div>
  );
}
