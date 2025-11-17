import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";

// 🔥 Suppress sourcemap warnings globally
const originalWarn = console.warn;
console.warn = (msg) => {
  if (msg && msg.toString().includes("Failed to parse source map")) return;
  originalWarn(msg);
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <>
    <App />
    <Toaster position="top-right" />
  </>
);
