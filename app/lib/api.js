import axios from "axios";

// Create a single Axios instance
const api = axios.create({
  baseURL: "https://sandboxbakery.suvotech.et/api/v1", // This includes https://sandboxbakery.suvotech.et/api/v1
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token automatically to every request if exists
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token"); // get token from localStorage
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`; // attach token
    }
  }
  return config;
});

export default api;
