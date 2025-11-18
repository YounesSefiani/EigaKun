import React, { createContext, useState, useEffect, useContext } from "react";
import connexion from "../connexion";
import { AuthContext } from "./AuthContext";

export const FavoritesContext = createContext();

function splitFavoritesByType(favorites) {
  return {
    movies: favorites.filter(fav => fav.favorite_type === "movie"),
    series: favorites.filter(fav => fav.favorite_type === "serie"),
    personalities: favorites.filter(fav => fav.favorite_type === "personality"),
  };
}

export function FavoritesProvider({ children }) {
  const { user, token } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setFavorites(Array.isArray(parsed) ? parsed : []);
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  useEffect(() => {
    if (token) {
      connexion
        .get("/userFavorites", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          // Correction ici : on prend rawFavorites si dispo, sinon tableau direct
          const raw = res.data.rawFavorites || res.data;
          setFavorites(Array.isArray(raw) ? raw : []);
          localStorage.setItem("favorites", JSON.stringify(raw));
        });
    }
  }, [token]);

  const refreshFavorites = async () => {
    if (!token) return;
    const res = await connexion.get("/userFavorites", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const raw = res.data.rawFavorites || res.data;
    setFavorites(Array.isArray(raw) ? raw : []);
    localStorage.setItem("favorites", JSON.stringify(raw));
  };

  const updateFavorite = async (favoriteId, favoriteType, status) => {
    if (!token) return;
    await connexion.post(
      "/userFavorites",
      { favoriteId, favoriteType, status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    await refreshFavorites();
  };

  const removeFavorite = async (favoriteId, favoriteType, status) => {
    if (!token) return;
    await connexion.delete(
      `/userFavorites?favoriteId=${favoriteId}&favoriteType=${favoriteType}&status=${status}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    await refreshFavorites();
  };

  const favoritesByType = splitFavoritesByType(favorites);

  return (
    <FavoritesContext.Provider
      value={{ favorites, updateFavorite, removeFavorite, splitFavoritesByType, favoritesByType, user }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}