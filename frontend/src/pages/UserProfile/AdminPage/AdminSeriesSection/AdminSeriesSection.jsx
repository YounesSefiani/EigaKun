import React, { useEffect, useContext, useState } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../../../../services/Context/AuthContext";
import connexion from "../../../../services/connexion";
import EigaKunLogo from "../../../../assets/EigaKunLogo.png";
import "./AdminSeriesSection.css";
import { useNavigate } from "react-router-dom";
import AdminSerieModal from "./AdminSerieModal/AdminSerieModal";
import AdminAddSerie from "./AdminAddSerie/AdminAddSerie";

function AdminSerieSection({ setView }) {
  const { user, token, handleAuthError, sessionExpired } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const [series, setSeries] = useState([]);
  const [selectedSerie, setSelectedSerie] = useState(null);
  const [showSerieModal, setShowSerieModal] = useState(false);
  const [showAddSerie, setShowAddSerie] = useState(false);

  useEffect(() => {
    if ((!user || !token) && !sessionExpired) {
      navigate("/");
      return;
    }
    if (user && token) {
      connexion
        .get(`/series`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setSeries(response.data);
        })
        .catch((error) => {
          handleAuthError(error);
        });
    }
  }, [user, token, handleAuthError, sessionExpired, navigate]);

  const handleOpenSerieModal = async (serie) => {
    // Récupère le serie complet avec casting
    const response = await connexion.get(`/series/${serie.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSelectedSerie(response.data);
    setShowSerieModal(true);
  };

  const handleCloseSerieModal = () => {
    setSelectedSerie(null);
    setShowSerieModal(false);
  };

  const handleUpdateSerie = (formData) => {
    connexion
      .put(`/series/${selectedSerie.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        const updated = response.data.updateSerie;
        setSeries((prevSeries) =>
          prevSeries.map((serie) =>
            serie.id === selectedSerie.id ? updated : serie
          )
        );
        setSelectedSerie(response.data);
        setShowSerieModal(false);
      })
      .catch((error) => {
        console.error("Error updating serie:", error);
      });
  };

  // ...existing code...
  const handleDeleteSerie = async (serieId) => {
    try {
      await connexion.delete(`/series/${serieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Rafraîchir la liste après suppression
      const response = await connexion.get(`/series`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSeries(response.data);
      setShowSerieModal(false);
      setSelectedSerie(null);
    } catch (error) {
      alert("Erreur lors de la suppression du serie");
    }
  };
  // ...existing code...
  return (
    <div className="adminSeriesSection">
      <h2>Les series</h2>
      <div className="adminBtnSection">
        <button type="button" onClick={() => setShowAddSerie(true)}>
          Ajouter une serie
        </button>
        <button type="button" onClick={() => setView("initial")}>
          Retour
        </button>
      </div>
      {showAddSerie && (
        <AdminAddSerie
          onClose={() => setShowAddSerie(false)}
          onSerieAdded={() => {
            connexion
              .get(`/series`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .then((response) => {
                setSeries(response.data);
                setShowAddSerie(false);
              })
              .catch((error) => {
                handleAuthError(error);
              });
          }}
        />
      )}
      <div className="adminSeriesList">
        {series.map((serie) => (
          <div
            key={serie.id}
            className="adminSerieCard"
            onClick={() => handleOpenSerieModal(serie)}
          >
            {serie.poster ? (
              <img
                src={
                  serie.poster && serie.poster.startsWith("http")
                    ? serie.poster
                    : serie.poster
                    ? `http://localhost:3994/src/assets/Series/Posters/${serie.poster}`
                    : ""
                }
                alt={serie.title}
              />
            ) : (
                <img src={EigaKunLogo} alt={serie.title} className="adminSeriePosterHolder" />
            )}
            <p>{serie.title}</p>
          </div>
        ))}
      </div>
      <AdminSerieModal
        serie={selectedSerie}
        show={showSerieModal}
        onClose={handleCloseSerieModal}
        onUpdate={handleUpdateSerie}
        onDelete={handleDeleteSerie}
      />
    </div>
  );
}

AdminSerieSection.propTypes = {
  setView: PropTypes.func.isRequired,
};

export default AdminSerieSection;
