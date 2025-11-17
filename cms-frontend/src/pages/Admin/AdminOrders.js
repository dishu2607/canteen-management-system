import React, { useEffect, useState } from "react";
import API from "../../api";
import toast from "react-hot-toast";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const res = await API.get("/admin/orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Auto-refresh every 8 sec
  useEffect(() => {
    fetchOrders();
    const iv = setInterval(fetchOrders, 8000);
    return () => clearInterval(iv);
  }, []);

  // Update order status
  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/admin/orders/${id}`, { status });
      toast.success(`Order ${status}`);
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update.");
    }
  };

  // Color badge style
  const getBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-200 text-yellow-800";
      case "preparing":
        return "bg-blue-200 text-blue-800";
      case "completed":
        return "bg-green-200 text-green-800";
      case "cancelled":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  // Disable buttons after final states
  const isLocked = (status) =>
    status === "completed" || status === "cancelled";

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h2 className="text-3xl font-bold mb-8">Order Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orders.map((o) => (
          <div
            key={o.order_id}
            className="bg-white rounded-xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition"
          >
            {/* Order Header */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-mono text-sm">{o.order_id}</p>
              </div>

              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getBadgeClass(o.status)}`}>
                {o.status}
              </span>
            </div>

            {/* Items */}
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-1">Items</p>
              <ul className="space-y-1">
                {o.order_items.map((it) => (
                  <li key={it.item_id} className="flex justify-between">
                    <span>{it.menu_items?.name || "Unknown Item"}</span>
                    <span className="text-sm text-gray-600">x {it.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                disabled={isLocked(o.status)}
                className={`px-4 py-2 rounded-lg text-white ${
                  isLocked(o.status)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={() => updateStatus(o.order_id, "preparing")}
              >
                Start
              </button>

              <button
                disabled={isLocked(o.status)}
                className={`px-4 py-2 rounded-lg text-white ${
                  isLocked(o.status)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
                onClick={() => updateStatus(o.order_id, "completed")}
              >
                {o.status === "completed" ? "Completed ✔" : "Complete"}
              </button>

              <button
                disabled={isLocked(o.status)}
                className={`px-4 py-2 rounded-lg text-white ${
                  isLocked(o.status)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
                onClick={() => updateStatus(o.order_id, "cancelled")}
              >
                {o.status === "cancelled" ? "Cancelled ✖" : "Cancel"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
