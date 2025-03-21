import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import "./EpisodesContainer.css";
import "bootstrap/dist/css/bootstrap.min.css";

function Episodes({ episodes }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="episodesContainer">
      <Button variant="primary" onClick={handleShow}>
        Voir les épisodes
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Les épisodes</Modal.Title>
          <button type="button" aria-label="closeBtn" onClick={handleClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </Modal.Header>
        <Modal.Body>
          <ul>
            {episodes.map((episode) => (
              <div className="episodes">
                <li key={episode.id}>
                  <div className="episodeImage">
                    <img
                      src={episode.image}
                      alt={`Episode ${episode.episode_number}`}
                    />
                  </div>
                  <div className="episodeDetails">
                    <h3>{episode.title}</h3>
                    <p>{episode.synopsis}</p>
                    <p>
                      Date de sortie :{" "}
                      {new Date(episode.release_date).toLocaleDateString()}
                    </p>
                  </div>
                </li>
              </div>
            ))}
          </ul>
        </Modal.Body>
      </Modal>
    </div>
  );
}

Episodes.propTypes = {
  episodes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      episode_number: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      image: PropTypes.string,
      release_date: PropTypes.string,
      synopsis: PropTypes.string,
    }),
  ).isRequired,
};

export default Episodes;
