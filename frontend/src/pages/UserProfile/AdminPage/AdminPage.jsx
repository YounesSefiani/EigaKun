import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import EigaKunLogo from "../../../assets/EigaKunLogo.png";
import "./AdminPage.css";
import { AuthContext } from "../../../services/Context/AuthContext";
import AdminMoviesSection from "./AdminMoviesSection/AdminMoviesSection";
import AdminSeriesSection from "./AdminSeriesSection/AdminSeriesSection";
import { useNavigate } from "react-router-dom";

function AdminPage() {
  const { user, token, logout, isLoading, handleAuthError, sessionExpired } = useContext(AuthContext);
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

  return (
    <div className="adminPage">
      <div className="adminBar">
        <img src={EigaKunLogo} alt="EigaKunLogo" />
        <div className="adminUser">
          {user && user.avatar ? (
            <img
              src={`http://localhost:3994/src/assets/Users/Avatars/${user.avatar}`}
              alt="avatar"
            />
          ) : (
            <div className="adminAvatarPlaceholder">
              <FontAwesomeIcon icon={faUser} />
            </div>
          )}
          <p>{user ? user.username : ""}</p>
        </div>
        <div className="adminBarButtons">
          <button type="button" onClick={() => setView("admin-movies-section")}>
            Les films
          </button>
          <button type="button" onClick={() => setView("admin-series-section")}>Les séries</button>
          <button type="button">Les personnalités</button>
          <button type="button">Les Users</button>
          <button type="button" onClick={() => navigate("/user")}>
            Mon Profil
          </button>
          <button type="button" onClick={() => logout()}>
            Déconnexion
          </button>
        </div>
      </div>
      {view === "initial" && <div className="adminSection"></div>}
      {view === "admin-movies-section" && (
        <AdminMoviesSection setView={setView} />
      )}
      {view === "admin-series-section" && (
        <AdminSeriesSection setView={setView} />
      )}
    </div>
  );
}

export default AdminPage;
