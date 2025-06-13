import React from "react";
import PropTypes from "prop-types";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import "./EpisodesContainer.css";

function EpisodesContainer({ episodes }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
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
          <button type="button" aria-label="closeBtn" onClick={handleClose}>
            <FontAwesomeIcon icon={faX} />
          </button>
        </Modal.Header>
        <Modal.Body>
          {episodes.length ? (
            <ul>
              {episodes.map((episode) => (
                <div className="episodeCard">
                  <li key={episode.id}>
                    <img
                      src={episode.image}
                      alt={`Episode ${episode.episode_number}`}
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
      <FontAwesomeIcon />
    </div>
  );
}

EpisodesContainer.propTypes = {
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
};

export default EpisodesContainer;
