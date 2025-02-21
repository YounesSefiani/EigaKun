// AuthContext.jsx
import React, { createContext, useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import connexion from "../services/connexion";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const toggleFavoriteMovie = (movie) => {
    setFavoriteMovies((prevFavorites) => {
      if (prevFavorites.some((fav) => fav.id === movie.id)) {
        // Remove from favorites
        return prevFavorites.filter((fav) => fav.id !== movie.id);
      }
      // Add to favorites
      return [...prevFavorites, movie];
    });
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");

    if (savedToken) {
      try {
        const decodedToken = JSON.parse(atob(savedToken.split(".")[1]));
        if (decodedToken.exp * 1000 < Date.now()) {
          // eslint-disable-next-line no-use-before-define
          logout();
        } else {
          setUser({
            id: decodedToken.sub,
            mail: decodedToken.mail,
            pseudo: decodedToken.pseudo,
            avatar: decodedToken.avatar,
            role: decodedToken.role,
            isVerified: decodedToken.isVerified,
          });
          setToken(savedToken);
        }
      } catch (error) {
        console.error("Erreur lors du décodage du token:", error);
        localStorage.removeItem("authToken");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, tokenData) => {
    setUser({ ...userData, isVerified: userData.isVerified });
    setToken(tokenData); // On stocke aussi le token dans l'état local
    localStorage.setItem("authToken", tokenData); // On stocke le token dans le localStorage
    localStorage.setItem("userId", userData.id); // On stocke l'id de l'utilisateur
    localStorage.setItem("user", JSON.stringify(userData)); // On stocke les données de l'utilisateur
    localStorage.setItem("avatar", userData.avatar); // On stocke l'avatar de l'utilisateur
  };

  const updateUser = (updatedUser, newToken) => {
    setUser(updatedUser);
    setToken(newToken);

    try {
      localStorage.setItem("authToken", newToken);
      localStorage.setItem("userId", updatedUser.id);
      localStorage.setItem("avatar", updatedUser.avatar);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Vérifie les valeurs dans localStorage
    } catch (error) {
      console.error("Error updating localStorage:", error);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const validateToken = async () => {
    try {
      const savedToken = localStorage.getItem("authToken");

      if (savedToken) {
        const response = await connexion.get(`/verify/${savedToken}`, {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          login(userData, savedToken);
        } else {
          logout();
        }
      } else {
        console.error("Token non trouvé dans localStorage");
      }
    } catch (error) {
      console.error("Erreur lors de la validation du token:", error);
    }
  };
  const contextValue = useMemo(
    () => ({
      user,
      token,
      login,
      updateUser,
      logout,
      loading,
      validateToken,
      msg,
      setMsg,
      favoriteMovies,
      toggleFavoriteMovie,
    }),
    [user, token, login, validateToken, msg, loading, updateUser],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
