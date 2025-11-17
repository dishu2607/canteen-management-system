import React, { useEffect, useState } from "react";
import API from "../../api";
import toast from "react-hot-toast";

export default function AdminMenu() {
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    is_available: true,
    stock: ""
  });

  useEffect(() => {
    fetchMenu();
  }, []);

  async function fetchMenu() {
    try {
      const r = await API.get("/menu_all");
      setMenu(r.data || []);

      r.data.forEach((m) => {
        if (m.stock < 5) toast.error(`Low stock: ${m.name}`);
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function addMenu(e) {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price) || 0,
        image_url: form.image_url || null,
        is_available: !!form.is_available,
        stock: Number(form.stock) || 0
      };

      await API.post("/menu", payload);
      toast.success("Menu item created!");

      setForm({
        name: "",
        description: "",
        price: "",
        image_url: "",
        is_available: true,
        stock: ""
      });

      fetchMenu();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create");
    }
  }

  async function deleteMenu(id) {
    try {
      await API.delete(`/menu/${id}`);
      toast.success("Deleted successfully!");
      fetchMenu();
    } catch (err) {
      toast.error("Delete failed");
    }
  }

  async function updateStock(id, newStock) {
    try {
      await API.put(`/menu/${id}`, { stock: Number(newStock) });
      toast.success("Stock updated!");
      fetchMenu();
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
      <h1 className="text-3xl font-bold mb-6">Manage Menu</h1>

      {/* Add Form */}
      <form onSubmit={addMenu} className="bg-white p-6 rounded shadow mb-6">
        <input
          className="w-full border px-3 py-2 mb-3"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <textarea
          className="w-full border px-3 py-2 mb-3"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <div className="flex gap-3 mb-3">
          <input
            className="flex-1 border px-3 py-2"
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
          />
          <input
            className="flex-1 border px-3 py-2"
            placeholder="Image URL"
            value={form.image_url}
            onChange={(e) =>
              setForm({ ...form, image_url: e.target.value })
            }
          />
        </div>

        <input
          className="w-full border px-3 py-2 mb-3"
          placeholder="Initial Stock"
          type="number"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />

        <label className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            checked={form.is_available}
            onChange={(e) =>
              setForm({ ...form, is_available: e.target.checked })
            }
          />
          Available
        </label>

        <button className="bg-orange-600 text-white px-4 py-2 rounded">
          Add Item
        </button>
      </form>

      {/* Existing Menu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menu.map((m) => (
          <div key={m.item_id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{m.name}</h3>
                <p className="text-sm text-gray-600">{m.description}</p>
                <div className="font-bold text-orange-600">
                  ₹{m.price}
                </div>
              </div>

              {/* Stock Badge */}
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">Stock</div>
                <span
                  className={`px-4 py-1 rounded-full font-bold text-lg ${stockBadge(
                    m.stock
                  )}`}
                >
                  {m.stock}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => deleteMenu(m.item_id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>

              <button
                onClick={() => {
                  const ns = prompt(
                    "Enter new stock value",
                    String(m.stock || 0)
                  );
                  if (ns !== null) updateStock(m.item_id, Number(ns));
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
