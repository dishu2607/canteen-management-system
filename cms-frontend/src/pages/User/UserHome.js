import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function UserHome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#cbe2ec] to-[#b7d8f0] flex flex-col items-center p-10">

      <motion.h1
        className="text-5xl font-extrabold text-blue-700 mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Welcome to the CMS 🍽️
      </motion.h1>

      <motion.p
        className="text-lg text-blue-900 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Fresh food, fast service — all at your fingertips.
      </motion.p>

      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        className="p-8 rounded-3xl shadow-xl bg-white/40 backdrop-blur-lg border border-white/20"
      >
        <h2 className="text-2xl font-semibold text-blue-700 mb-4 text-center">
          Today’s Specials 🚀
        </h2>

        <p className="text-blue-900 text-center mb-6">
          Explore our freshly updated menu — straight from the kitchen!
        </p>

        <div className="flex justify-center">
          <Link to="/user/menu">
            <button className="px-10 py-3 bg-blue-600 hover:bg-blue-700 transition text-white rounded-full shadow-lg text-lg">
              Browse Menu →
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
