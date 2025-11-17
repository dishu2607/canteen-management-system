// src/pages/Home.js
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Home.css";

export default function Home() {
  const imageRef = useRef(null);
  const navigate = useNavigate();

  const [isHovered, setIsHovered] = useState(false);
  const [hoverText, setHoverText] = useState("");
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

  // Hotspot Areas
  const areas = [
    {
      name: "Inventory",
      x1: 1200,
      x2: 1500,
      y1: 350,
      y2: 600,
      route: "/admin/inventory",
    },
    {
      name: "Track Orders",
      x1: 900,
      x2: 1200,
      y1: 200,
      y2: 400,
      route: "/admin/orders",
    },
    {
      name: "Browse Menu",
      x1: 550,
      x2: 850,
      y1: 250,
      y2: 450,
      route: "/user",
    },
  ];

  const handleClick = (event) => {
    const rect = imageRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const clicked = areas.find(
      (a) => x >= a.x1 && x <= a.x2 && y >= a.y1 && y <= a.y2
    );

    if (clicked) navigate(clicked.route);
  };

  const handleHover = (event) => {
    const rect = imageRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const hovered = areas.find(
      (a) => x >= a.x1 && x <= a.x2 && y >= a.y1 && y <= a.y2
    );

    if (hovered) {
      setIsHovered(true);
      setHoverText(hovered.name);
      setHoverPos({ x, y });
    } else {
      setIsHovered(false);
    }
  };

  return (
    <div className="landing-wrapper">
      {/* Background Hero Section */}
      <div
        className="hero-section"
        ref={imageRef}
        onClick={handleClick}
        onMouseMove={handleHover}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Main Heading */}
        <motion.h1
          className="main-heading"
          initial={{ opacity: 0, y: -80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Canteen Management System
        </motion.h1>

        {/* Subtitle */}
        <motion.h2
          className="sub-heading"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Reduce the Mess • Order Smart • Save Time
        </motion.h2>

        {/* Hover Bubble */}
        {isHovered && (
          <div
            className="hover-bubble"
            style={{
              top: hoverPos.y,
              left: hoverPos.x,
              transform: "translate(-50%, -50%)",
            }}
          >
            {hoverText}
          </div>
        )}
      </div>

      {/* Footer Options */}
      <div className="home-buttons">
        <button onClick={() => navigate("/user")} className="home-btn user-btn">
          User Panel
        </button>
        <button onClick={() => navigate("/admin")} className="home-btn admin-btn">
          Admin Panel
        </button>
      </div>
    </div>
  );
}
