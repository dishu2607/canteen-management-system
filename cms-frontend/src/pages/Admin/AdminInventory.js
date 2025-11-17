import React, { useEffect, useState } from "react";
import API from "../../api";
import toast from "react-hot-toast";

export default function AdminInventory() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    quantity: "",
    cost_price: ""
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  async function fetchInventory() {
    try {
      const r = await API.get("/inventory");
      setItems(r.data || []);

      r.data.forEach((it) => {
        if (it.quantity < 5) {
          toast.error(`Low stock: ${it.name}`);
        }
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load inventory");
    }
  }

  async function addInventory(e) {
    e.preventDefault();
    try {
      await API.post("/inventory", {
        name: form.name,
        quantity: Number(form.quantity) || 0,
        cost_price: Number(form.cost_price) || 0
      });

      toast.success("Inventory item added!");
      setForm({ name: "", quantity: "", cost_price: "" });
      fetchInventory();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add item");
    }
  }

  async function deleteInv(id) {
    try {
      await API.delete(`/inventory/${id}`);
      toast.success("Deleted");
      fetchInventory();
    } catch (err) {
      toast.error("Delete failed");
    }
  }

  async function updateStock(id, newQty) {
    try {
      await API.put(`/inventory/${id}`, { quantity: Number(newQty) });
      toast.success("Stock updated");
      fetchInventory();
    } catch (err) {
      toast.error("Update failed");
    }
  }

  const stockBadge = (qty) => {
    if (qty < 5)
      return "bg-red-100 text-red-700 border border-red-400";
    if (qty < 10)
      return "bg-yellow-100 text-yellow-700 border border-yellow-400";
    return "bg-green-100 text-green-700 border border-green-400";
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Inventory Status</h1>

      {/* Add New Inventory */}
      <form onSubmit={addInventory} className="bg-white p-6 rounded shadow mb-6">
        <input
          className="w-full border px-3 py-2 mb-3"
          placeholder="Item Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="w-full border px-3 py-2 mb-3"
          placeholder="Initial Quantity"
          type="number"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />

        <input
          className="w-full border px-3 py-2 mb-3"
          placeholder="Cost Price"
          type="number"
          value={form.cost_price}
          onChange={(e) => setForm({ ...form, cost_price: e.target.value })}
        />

        <button className="bg-orange-600 text-white px-4 py-2 rounded">
          Add Inventory Item
        </button>
      </form>

      {/* Inventory List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((it) => (
          <div key={it.inventory_id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{it.name}</h3>
                <p className="text-sm text-gray-600">
                  Cost Price: ₹{it.cost_price}
                </p>
              </div>

              {/* Highlighted Stock Badge */}
              <div>
                <div className="text-sm text-gray-500 text-right mb-1">Stock</div>
                <span
                  className={`px-4 py-1 rounded-full font-bold text-lg ${stockBadge(
                    it.quantity
                  )}`}
                >
                  {it.quantity}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => deleteInv(it.inventory_id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>

              <button
                onClick={() => {
                  const ns = prompt(
                    "Enter new stock value",
                    String(it.quantity || 0)
                  );
                  if (ns !== null) updateStock(it.inventory_id, Number(ns));
                }}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Edit Stock
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
