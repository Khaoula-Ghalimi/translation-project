import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const auth = localStorage.getItem("auth_basic"); 

    if (auth) {
      config.headers.Authorization = auth;
    }
  }

  return config;
});

export default api;