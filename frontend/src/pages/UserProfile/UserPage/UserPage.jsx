import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../services/Context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import "./UserPage.css";
import UserFavoritesMoviesSection from "../UserFavoritesMoviesSection/UserFavoritesMoviesSection";
import UserFavoritesSeriesSection from "../UserFavoritesSeriesSection/UserFavoritesSeriesSection";
import UserFavoritesPersonalitiesSection from "../UserFavoritesPersonalitiesSection/UserFavoritesPersonalitiesSection";
import UserSettings from "../UserSettings/UserSettings";
import { useNavigate } from "react-router-dom";

function UserPage() {
  const { user, token, handleAuthError, sessionExpired, isLoading } =
    useContext(AuthContext);
  const [view, setView] = useState("initial");
  const navigate = useNavigate();

useEffect(() => {
  if (isLoading) return; // NE RIEN FAIRE tant que le contexte charge
  if ((!user || !token) && !sessionExpired) {
    navigate("/");
    return;
  }
  // ...
}, [user, token, isLoading, handleAuthError, sessionExpired, navigate]);
  // Si la session est expirée, on affiche uniquement le message

  return (
    <div className="userPage">
      <div className="userBar">
        {user && user.role === "Admin" ? (
          <button type="button" onClick={() => navigate("/user/admin")}>
            Mode Admin
          </button>
        ) : null}
        <button type="button" onClick={() => setView("favorites-movies")}>
          Mes films
        </button>
        <button type="button" onClick={() => setView("favorites-series")}>
          Mes séries
        </button>
        <button
          type="button"
          onClick={() => setView("favorites-personalities")}
        >
          Mes personnalités
        </button>
        <button type="button">Mes critiques</button>
        <button type="button" onClick={() => setView("settings")}>
          Paramètres
        </button>
      </div>
      {view === "initial" && (
        <div className="userSection">
          <div className="userHeader">
            {user && user.avatar ? (
              <img
                src={`http://localhost:3994/src/assets/Users/Avatars/${user.avatar}`}
                alt="avatar"
              />
            ) : (
              <div className="avatarHolder">
                <FontAwesomeIcon icon={faUser} />
              </div>
            )}
            <h4>{user ? user.username : ""}</h4>
          </div>
        </div>
      )}
      {view === "favorites-movies" && (
        <UserFavoritesMoviesSection setView={setView} />
      )}
      {view === "favorites-series" && (
        <UserFavoritesSeriesSection setView={setView} />
      )}
      {view === "favorites-personalities" && (
        <UserFavoritesPersonalitiesSection setView={setView} />
      )}
      {view === "settings" && <UserSettings setView={setView} />}
    </div>
  );
}

export default UserPage;
