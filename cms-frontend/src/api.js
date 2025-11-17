// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api",
  timeout: 15000
});

export default API;
