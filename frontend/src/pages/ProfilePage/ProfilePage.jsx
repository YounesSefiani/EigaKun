import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/Header/Header";
import ProfileSettings from "./ProfileSettings/ProfileSettings";
import "./ProfilePage.css";
import HeaderPhone from "../../components/Header/HeaderPhone/HeaderPhone";
import FooterPhone from "../../components/Header/FooterPhone/FooterPhone";

function ProfilePage() {
  const { user, token, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(user); // Assure-toi d'initialiser userData
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("initial");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setUserData(user);
      setLoading(false);
    } else if (token) {
      const userId = localStorage.getItem("userId");
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const { data } = response;
          setUserData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching user data:", err);
          setError("Failed to load user data");
          setLoading(false);
        });
    }
  }, [user, token]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>No user data available.</div>;
  }

  return (
    <>
      <Header />
      <HeaderPhone />
      <div className="profilePage">
        <div className="profileBar">
          <ul>
            {user.role === "Admin" && (
              <li>
                <button type="button" className="adminButton">
                  <Link to="/user/admin">Mode Admin</Link>
                </button>
              </li>
            )}
            <li>
              <button
                type="button"
                onClick={() => setView("préférences")}
                className={`navButton ${view === "préférences" ? "active" : ""}`}
              >
                Paramètres
              </button>
            </li>
            <div className="logOut">
              <button type="button" onClick={handleLogout}>
                Déconnexion
              </button>
            </div>
          </ul>
        </div>

        <div className="profileView">
          {view === "initial" && (
            <div className="profileHeader">
              <div className="avatar">
                {user.avatar ? (
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/src/assets/Users/${user.avatar}`}
                    alt={user.pseudo}
                  />
                ) : (
                  <FontAwesomeIcon icon={faUser} />
                )}
              </div>
              <p>{userData.pseudo}</p>
            </div>
          )}
          {view === "préférences" && (
            <ProfileSettings
              setView={setView}
              onUpdate={(updatedUser) => setUserData(updatedUser)}
              userData={userData}
            />
          )}
        </div>
      </div>
      <FooterPhone />
    </>
  );
}

export default ProfilePage;
