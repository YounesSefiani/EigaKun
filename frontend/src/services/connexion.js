import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_URL
    ? `${process.env.REACT_APP_URL}/api`
    : "http://localhost:3994/api",
  withCredentials: false,
});

// Interceptor pour ajouter le token
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor pour gérer les erreurs 401
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Nettoie le localStorage et force la déconnexion
      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");
      window.location.href = "/authentification";
    }
    return Promise.reject(error);
  }
);

export default instance;