import React, { useEffect, useContext, useState } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../../../../services/Context/AuthContext";
import connexion from "../../../../services/connexion";
import EigaKunLogo from "../../../../assets/EigaKunLogo.png";
import { useNavigate } from "react-router-dom";
import AdminPersonalityModal from "./AdminPersonalityModal/AdminPersonalityModal";
import AdminAddPersonality from "./AdminAddPersonality/AdminAddPersonality";
import "./AdminPersonalitiesSection.css";

function AdminPersonalitiesSection({ setView }) {
  const { user, token, handleAuthError, sessionExpired } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const [personalities, setPersonalities] = useState([]);
  const [selectedPersonality, setSelectedPersonality] = useState(null);
  const [showPersonalityModal, setShowPersonalityModal] = useState(false);
  const [showAddPersonality, setShowAddPersonality] = useState(false);

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

  const handleOpenPersonalityModal = async (personality) => {
    // Récupère la personnalité complète avec filmographie
    const response = await connexion.get(`/personalities/${personality.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("2. Réponse API reçue:", response.data);
    setSelectedPersonality(response.data);

    console.log("3. selectedPersonality mis à jour");
    setShowPersonalityModal(true);

    console.log("4. showPersonalityModal = true");
  };

  const handleClosePersonalityModal = () => {
    setSelectedPersonality(null);
    setShowPersonalityModal(false);
  };

  const handleUpdatePersonality = (updatedPersonality) => {
    setPersonalities((prev) =>
      prev.map((p) =>
        p.id === updatedPersonality.id ? { ...p, ...updatedPersonality } : p
      )
    );
    setSelectedPersonality(updatedPersonality);
    setShowPersonalityModal(false);
  };

  const handleDeletePersonality = async (personalityId) => {
    // Logique de suppression
    console.log("Suppression personnalité:", personalityId);
  };

  return (
    <div className="adminPersonalitiesSection">
      <h2>Les personnalités</h2>
      <div className="adminBtnSection">
        <button type="button" onClick={() => setShowAddPersonality(true)}>
          Ajouter une personnalité
        </button>
        <button type="button" onClick={() => setView("initial")}>
          Retour
        </button>
      </div>
      {showAddPersonality && (
        <AdminAddPersonality
          onClose={() => setShowAddPersonality(false)}
          onPersonalityAdded={() => {
            connexion
              .get(`/personalities`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .then((response) => {
                setPersonalities(response.data);
                setShowAddPersonality(false);
              })
              .catch((error) => {
                handleAuthError(error);
              });
          }}
        />
        )}
      <div className="adminPersonalitiesList">
        {personalities.map((personality) => (
          <div
            key={personality.id}
            className="adminPersonalityCard"
            onClick={() => handleOpenPersonalityModal(personality)}
          >
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
      <AdminPersonalityModal
        personality={selectedPersonality}
        show={showPersonalityModal}
        onClose={handleClosePersonalityModal}
        onUpdate={handleUpdatePersonality}
        onDelete={handleDeletePersonality}
      />
    </div>
  );
}

AdminPersonalitiesSection.propTypes = {
  setView: PropTypes.func.isRequired,
};

export default AdminPersonalitiesSection;
