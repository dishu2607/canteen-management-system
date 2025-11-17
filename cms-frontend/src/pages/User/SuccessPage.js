import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#cbe2ec] to-[#b7d8f0] flex items-center justify-center p-6">
      
      <motion.div
        className="bg-white/60 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20 text-center max-w-xl"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
      >

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120, delay: 0.2 }}
        >
          <CheckCircle size={140} className="text-green-600 mx-auto mb-6" />
        </motion.div>

        <motion.h1
          className="text-4xl font-extrabold text-green-700 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Order Successful! 🎉
        </motion.h1>

        <motion.p
          className="text-lg text-gray-700 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Your order is being prepared with love 💛  
          Hang tight! Deliciousness is on the way.
        </motion.p>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Link to="/user/menu">
            <button className="px-8 py-3 bg-blue-700 text-white rounded-xl text-lg shadow-md hover:bg-blue-800">
              Back to Menu 🍽
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
