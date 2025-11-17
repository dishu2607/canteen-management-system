import React from "react";
import { Link } from "react-router-dom";

export default function AdminHome() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-bold mb-10">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <Link
          to="/admin/orders"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg border"
        >
          <h2 className="text-xl font-semibold">Order Management</h2>
          <p className="text-gray-500 mt-2">View & update orders</p>
        </Link>

        <Link
          to="/admin/inventory"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg border"
        >
          <h2 className="text-xl font-semibold">Inventory Stock</h2>
          <p className="text-gray-500 mt-2">Add, Edit, Delete Inventory</p>
        </Link>

        <Link
          to="/admin/add-menu"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg border"
        >
          <h2 className="text-xl font-semibold">Add Menu Item</h2>
          <p className="text-gray-500 mt-2">Add, Edit, Delete Menu Items</p>
        </Link>

        
      </div>
    </div>
  );
}
