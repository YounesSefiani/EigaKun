import React, { useEffect, useContext, useState } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../../../../services/Context/AuthContext";
import connexion from "../../../../services/connexion";
import EigaKunLogo from "../../../../assets/EigaKunLogo.png";
import { useNavigate } from "react-router-dom";
import "./AdminPersonalitiesSection.css";

function AdminPersonalitiesSection({ setView }) {
  const { user, token, handleAuthError, sessionExpired } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const [personalities, setPersonalities] = useState([]);

  useEffect(() => {
    if ((!user || !token) && !sessionExpired) {
      navigate("/");
      return;
    }
    if (user && token) {
      connexion
        .get(`/personalities`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setPersonalities(response.data);
        })
        .catch((error) => {
          handleAuthError(error);
        });
    }
  }, [user, token, handleAuthError, sessionExpired, navigate]);

  return (
    <div className="adminPersonalitiesSection">
      <h2>Les personnalités</h2>
      <div className="adminBtnSection">
        <button type="button">Ajouter une personnalité</button>
        <button type="button" onClick={() => setView("initial")}>
          Retour
        </button>
      </div>
      <div className="adminPersonalitiesList">
        {personalities.map((personality) => (
          <div key={personality.id} className="adminPersonalityCard">
            {personality.image_src ? (
              <img
                src={
                  personality.image_src &&
                  personality.image_src.startsWith("http")
                    ? personality.image_src
                    : personality.image_src
                    ? `http://localhost:3994/src/assets/Personalities/Images/${personality.image_src}`
                    : ""
                }
                alt={personality.fullname}
              />
            ) : (
              <div className="adminPersonalityAvatarHolder">
                <img src={EigaKunLogo} alt={personality.fullname} />
              </div>
            )}
            <p>{personality.fullname}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPersonalitiesSection;
