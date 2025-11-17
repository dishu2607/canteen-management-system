import React, { useEffect, useState } from "react";
import API from "../../api";
import { Link } from "react-router-dom";
import { Plus, Minus } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function MenuPage() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchMenu();
  }, []);

  async function fetchMenu() {
    try {
      const res = await API.get("/menu");
      setMenu(res.data || []);
    } catch (err) {
      console.error("fetchMenu err", err);
    }
  }

  const changeQty = (item, action) => {
    const found = cart.find((c) => c.item_id === item.item_id);

    if (!found) {
      if (action === "inc") {
        if (item.stock <= 0) return toast.error("Out of stock!");
        setCart([...cart, { ...item, qty: 1 }]);
      }
      return;
    }

    if (action === "inc") {
      if (found.qty >= item.stock) {
        return toast.error(`Only ${item.stock} left`);
      }
      setCart(cart.map((c) =>
        c.item_id === item.item_id ? { ...c, qty: c.qty + 1 } : c
      ));
    } else {
      setCart(cart.map((c) =>
        c.item_id === item.item_id ? { ...c, qty: Math.max(0, c.qty - 1) } : c
      ));
    }
  };

  const addToCart = () => {
    toast.success("Items added to cart successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#cbe2ec] to-[#b7d8f0] p-6">

      <motion.h1
        className="text-5xl font-bold text-center text-blue-700 mb-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        Today’s Specials 🍛
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {menu.map((item) => {
          const inCart = cart.find((c) => c.item_id === item.item_id);

          return (
            <motion.div
              key={item.item_id}
              className="bg-white/50 backdrop-blur-lg rounded-3xl shadow-xl p-4 border border-white/20"
              whileHover={{ scale: 1.03 }}
            >
              <img
                src={item.image_url || "https://picsum.photos/300/200?food"}
                className="w-full h-40 object-cover rounded-xl"
                alt={item.name}
              />

              <h2 className="text-xl font-bold text-blue-800 mt-3">{item.name}</h2>
              <p className="text-gray-700">{item.description}</p>

              <div className="mt-2 text-2xl font-bold text-blue-600">₹{item.price}</div>

              <div
                className={`mt-1 font-semibold ${
                  item.stock === 0
                    ? "text-red-600"
                    : item.stock < 5
                    ? "text-yellow-600"
                    : "text-green-700"
                }`}
              >
                Stock: {item.stock}
              </div>

              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={() => changeQty(item, "dec")}
                  className="p-2 bg-gray-200 rounded-full"
                >
                  <Minus size={16} />
                </button>

                <span className="font-bold text-lg">{inCart?.qty || 0}</span>

                <button
                  onClick={() => changeQty(item, "inc")}
                  className="p-2 bg-blue-600 text-white rounded-full"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* ⭐ UPDATED ADD TO CART BUTTON ⭐ */}
              <button
                onClick={item.stock === 0 ? null : addToCart}
                disabled={item.stock === 0}
                className={`w-full mt-4 py-2 rounded-full transition text-white 
                  ${item.stock === 0 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                {item.stock === 0 ? "Out of Stock ❌" : "Add to Cart 🛒"}
              </button>

            </motion.div>
          );
        })}
      </div>

      <Link to="/user/cart" state={{ cart }}>
        <button className="fixed bottom-6 right-6 px-6 py-3 bg-blue-700 text-white rounded-full shadow-lg">
          View Cart 🛒
        </button>
      </Link>
    </div>
  );
}
