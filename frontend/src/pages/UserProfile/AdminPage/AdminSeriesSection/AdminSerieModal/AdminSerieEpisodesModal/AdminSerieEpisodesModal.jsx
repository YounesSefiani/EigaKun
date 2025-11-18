import React from "react";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import connexion from "../../../../../../services/connexion";
import Modal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import AdminSerieEpisodesEdit from "./AdminSerieEpisodesEdit/AdminSerieEpisodesEdit";
import AdminSerieEpisodesAdd from "../AdminSerieEpisodesModal/AdminSerieEpisodeAdd/AdminSerieEpisodeAdd";
import "./AdminSerieEpisodesModal.css";

function AdminSerieEpisodesContainer({
  episodes,
  onClose,
  onUpdate,
  onDelete,
  serieId,
  seasonId,
}) {
  const [show, setShow] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState(null);
  const [localEpisodes, setLocalEpisodes] = useState(episodes || []);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setLocalEpisodes(episodes);
  }, [episodes]);

  const handleAddEpisode = async (newEpisode) => {
    // Si le backend ne retourne pas l'épisode complet
    if (!newEpisode.title || !newEpisode.episode_number) {
      try {
        const getResponse = await connexion.get(`/episodes/${newEpisode.id}`);
        setLocalEpisodes((prev) => [...prev, getResponse.data]);
      } catch (err) {
        // Optionnel : gérer l'erreur
      }
    } else {
      setLocalEpisodes((prev) => [...prev, newEpisode]);
    }
    setIsAdding(false);
  };
  const handleUpdateEpisode = (updatedEpisode) => {
    setLocalEpisodes((prev) =>
      prev.map((ep) => (ep.id === updatedEpisode.id ? updatedEpisode : ep))
    );
    setIsEditing(false);
    setEditingEpisode(null);
    if (typeof onUpdate === "function") {
      onUpdate(updatedEpisode);
    }
  };

  // Handler pour annuler
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingEpisode(null);
  };

  // Handler pour suppression
  const handleDeleteEpisode = (episodeId) => {
    setLocalEpisodes((prev) => prev.filter((ep) => ep.id !== episodeId));
    setIsEditing(false);
    setEditingEpisode(null);
    if (typeof onDelete === "function") {
      onDelete(episodeId);
    }
  };

  const handleClose = () => {
    setShow(false);
    setIsAdding(false);
    setIsEditing(false);
  };
  const handleShow = () => setShow(true);

  const formatDate = (date) => {
    const zeroPad = (number) => (number < 10 ? "0" : "") + number;
    const episodeDate = new Date(date);
    const day = zeroPad(episodeDate.getDate());
    const month = zeroPad(episodeDate.getMonth() + 1);
    const year = episodeDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="episodesContainer">
      <button onClick={handleShow}>Voir les épisodes</button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Les épisodes</Modal.Title>
          <div className="addEpisodeButtons">
            <button type="button" aria-label="closeBtn" onClick={handleClose}>
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>
        </Modal.Header>
        <Modal.Body>
          {isAdding ? (
            <AdminSerieEpisodesAdd
              serieId={serieId}
              seasonId={seasonId}
              onAdd={handleAddEpisode}
            />
          ) : isEditing && editingEpisode ? (
            <AdminSerieEpisodesEdit
              episode={editingEpisode}
              onUpdate={handleUpdateEpisode}
              onCancel={handleCancelEdit}
              onDelete={handleDeleteEpisode}
            />
          ) : localEpisodes.length ? (
            <ul>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(true);
                  setIsEditing(false);
                  setEditingEpisode(null);
                }}
              >
                Ajouter un épisode
              </button>
              {localEpisodes.map((episode) => (
                <div className="episodeCard" key={episode.id}>
                  <li>
                    <img
                      src={
                        episode.image && episode.image.startsWith("http")
                          ? episode.image
                          : episode.image
                          ? `http://localhost:3994/src/assets/Series/Episodes/Images/${episode.image}`
                          : ""
                      }
                      alt={episode.title}
                    />
                    <div className="episodeDetails">
                      <h3>
                        {episode.episode_number} - {episode.title}
                      </h3>
                      <p>
                        Date de diffusion : {formatDate(episode.release_date)}
                      </p>
                      <div className="episodeSynopsis">
                        <p>{episode.synopsis}</p>
                      </div>
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setEditingEpisode(episode);
                        }}
                      >
                        Modifier
                      </button>
                    </div>
                  </li>
                </div>
              ))}
            </ul>
          ) : (
            <p>Aucun épisode pour le moment.</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

AdminSerieEpisodesContainer.propTypes = {
  episodes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      episode_number: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      release_date: PropTypes.string.isRequired,
      synopsis: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  serieId: PropTypes.number.isRequired,
  seasonId: PropTypes.number.isRequired,
  seasons: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      season_number: PropTypes.number.isRequired,
      poster: PropTypes.string,
      first_episode_date: PropTypes.string,
      last_episode_date: PropTypes.string,
      synopsis: PropTypes.string,
      episodes: PropTypes.array.isRequired,
    })
  ),
};

export default AdminSerieEpisodesContainer;
