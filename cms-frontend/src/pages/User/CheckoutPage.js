import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../api";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.cart || [];

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const pay = async () => {
    try {
      await API.post("/orders", {
        user_id: "00000000-0000-0000-0000-000000000001",
        cart,
        paymentMethod: "Wallet",
      });
      toast.success("Order placed successfully!");
      navigate("/user/success");
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#b7d8f0] to-[#cbe2ec] p-6 flex justify-center">
      <motion.div
        className="bg-white/60 backdrop-blur-xl shadow-xl rounded-3xl p-8 w-full max-w-lg border border-white/20"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-blue-800 mb-8 text-center">
          Checkout 💳
        </h1>

        {cart.map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center py-3 border-b border-gray-300/40"
          >
            <span className="text-lg text-blue-900">
              {item.name} ({item.qty})
            </span>
            <span className="text-lg font-bold text-blue-700">
              ₹{item.qty * item.price}
            </span>
          </div>
        ))}

        <div className="flex justify-between text-3xl font-bold mt-6 text-blue-900">
          <span>Total:</span>
          <span>₹{total}</span>
        </div>

        <motion.button
          className="mt-8 w-full bg-blue-700 text-white py-3 text-xl rounded-xl shadow-lg hover:bg-blue-800"
          onClick={pay}
          whileTap={{ scale: 0.95 }}
        >
          Confirm Order ✔
        </motion.button>
      </motion.div>
    </div>
  );
}
