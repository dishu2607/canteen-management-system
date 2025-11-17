import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function CartPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.cart || [];

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const proceed = () => {
    for (const c of cart) {
      if (c.qty > c.stock) {
        return toast.error(`${c.name}: Only ${c.stock} available`);
      }
    }
    navigate("/user/checkout", { state: { cart } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#cbe2ec] to-[#b7d8f0] p-6 flex justify-center">
      
      <motion.div
        className="bg-white/60 backdrop-blur-xl shadow-xl rounded-3xl p-8 w-full max-w-3xl border border-white/20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        
        <motion.h1
          className="text-4xl font-bold text-blue-800 mb-8 text-center"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          Your Cart 🛒
        </motion.h1>

        {cart.length === 0 ? (
          <div className="text-center text-gray-700 text-lg py-10">
            Your cart is empty.
            <div className="mt-4">
              <Link
                to="/user/menu"
                className="text-blue-700 underline font-semibold"
              >
                Browse Menu
              </Link>
            </div>
          </div>
        ) : (
          <div>
            {cart.map((item, idx) => (
              <motion.div
                key={idx}
                className="flex justify-between items-center py-4 border-b border-gray-300/40"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div>
                  <h3 className="text-lg font-semibold text-blue-800">
                    {item.name}
                  </h3>
                  <p className="text-gray-600">{item.qty} × ₹{item.price}</p>
                  <p className="text-sm text-red-600">
                    {item.stock} left in stock
                  </p>
                </div>
                <p className="text-xl font-bold text-blue-700">
                  ₹{item.qty * item.price}
                </p>
              </motion.div>
            ))}

            <div className="flex justify-between text-3xl font-bold mt-8 text-blue-900">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <motion.button
              onClick={proceed}
              className="w-full mt-8 py-3 text-xl rounded-xl text-white bg-blue-700 hover:bg-blue-800 shadow-lg"
              whileTap={{ scale: 0.95 }}
            >
              Proceed to Pay 💳
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
