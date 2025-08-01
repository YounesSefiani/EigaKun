import React, { useState } from "react";
import PropTypes from "prop-types";
import AdminMovieEditForm from "./AdminMovieEditForm/AdminMovieEditForm";
import HorizontallScroll from "../../../../../components/HorizontalScroll/HorizontalScroll";
import "./AdminMovieModal.css";

function AdminMovieModal({ movie, show, onClose, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);

  if (!show || !movie) return null;

  const casting = movie.casting || [];
  const directing = casting.filter((cast) => cast.side === "Directing");
  const acting = casting.filter((cast) => cast.side === "Acting");

  // Handler pour la mise à jour du film (appelé à la soumission du formulaire d'édition)
  const handleUpdate = async (formData) => {
    // Appel du parent pour mettre à jour le film (incluant le casting)
    await onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <>
      <div className="adminMovieOverlay" onClick={onClose} />
      <div className="adminMovieModal">
        {!isEditing ? (
          <div className="adminMovie">
            <div className="adminMovieTop">
              <h2>{movie.title}</h2>
              <div>
                <button onClick={() => setIsEditing(true)}>Modifier</button>
                <button onClick={onClose}>Fermer</button>
              </div>
            </div>
            <div className="adminMovieContent">
              <div className="adminMovieLeft">
                <div>
                  <p>Affiche :</p>
                  <img
                    src={
                      movie.poster && movie.poster.startsWith("http")
                        ? movie.poster
                        : movie.poster
                        ? `http://localhost:3994/src/assets/Movies/Posters/${movie.poster}`
                        : ""
                    }
                    className="adminMoviePoster"
                    alt={movie.title}
                  />
                </div>
                <div>
                  <p>Arrière-plan :</p>
                  <img
                    src={
                      movie.background && movie.background.startsWith("http")
                        ? movie.background
                        : movie.background
                        ? `http://localhost:3994/src/assets/Movies/Backgrounds/${movie.background}`
                        : ""
                    }
                    className="adminMovieBackground"
                    alt={movie.title}
                  />
                </div>
              </div>
              <div className="adminMovieRight">
                {movie.logo ? (
                  <img
                    src={
                      movie.logo && movie.logo.startsWith("http")
                        ? movie.logo
                        : movie.logo
                        ? `http://localhost:3994/src/assets/Movies/Logos/${movie.logo}`
                        : ""
                    }
                    className="adminMovieLogo"
                    alt={movie.title}
                  />
                ) : (
                  <div className="adminMovieLogoHolder">
                    <p>Aucun logo pour le moment.</p>
                  </div>
                )}
                <div className="adminMovieInfos">
                  <p>
                    <strong>Date de sortie :</strong> <br /> {movie.release_date}
                  </p>
                  <p>
                    <strong>Durée :</strong> <br /> {movie.duration}
                  </p>
                  <p>
                    <strong>Genre(s) :</strong> <br /> {movie.genre}
                  </p>
                  <p>
                    <strong>Thème(s) :</strong> <br /> {movie.theme}
                  </p>
                  <p>
                    <strong>Origine(s) :</strong> <br /> {movie.country}
                  </p>
                  <p>
                    <strong>Sortie :</strong> <br /> {movie.screen}
                  </p>
                  {movie.streaming ? (
                    <p>
                      <strong>Streaming :</strong> <br /> {movie.streaming}
                    </p>
                  ) : null}
                  {movie.universe ? (
                    <p>
                      <strong>Univers :</strong> <br /> {movie.universe}
                    </p>
                  ) : null}
                  {movie.subUniverse ? (
                    <p>
                      <strong>Sous-univers :</strong> <br /> {movie.subUniverse}
                    </p>
                  ) : null}
                </div>
                <div className="adminMovieSynopsisTrailer">
                  <div className="adminMovieSynopsis">
                    <h3>Synopsis</h3>
                    <p>{movie.synopsis}</p>
                  </div>
                  <div className="adminMovieTrailer">
                    <h3>Trailer</h3>
                    <iframe
                      src={movie.trailer}
                      title="trailer"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
            <div className="adminMovieCasting">
              <h3>Casting du film "{movie.title}"</h3>
              <div className="adminMovieCastingSection">
                <h3>Realisation</h3>
                <div className="adminMovieCastingList">
                  <HorizontallScroll>
                    {directing.length > 0 ? (
                      directing.map((direction) => (
                        <div
                          className="adminMovieCastingCard"
                          key={direction.id}
                        >
                          <img
                            src={direction.personality_image}
                            alt={direction.personality_fullname}
                          />
                          <p>{direction.personality_fullname}</p>
                          <p>
                            <strong>Role :</strong>
                            <br />
                            {direction.role}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>Aucun réalisateur pour le moment.</p>
                    )}
                  </HorizontallScroll>
                </div>
              </div>
              <div className="adminMovieCastingSection">
                <h3>Acteurs et Actrices</h3>
                <div className="adminMovieCastingList">
                  <HorizontallScroll>
                    {acting.length > 0 ? (
                      acting.map((actor) => (
                        <div className="adminMovieCastingCard" key={actor.id}>
                          <img
                            src={actor.personality_image}
                            alt={actor.personality_fullname}
                          />
                          <p>{actor.personality_fullname}</p>
                          <p>
                            <strong>Role :</strong>
                            <br />
                            {actor.role}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>Aucun acteur pour le moment.</p>
                    )}
                  </HorizontallScroll>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <AdminMovieEditForm
  movie={movie}
  onUpdate={handleUpdate}
  onCancel={() => setIsEditing(false)}
  onDelete={() => {
    if (typeof onDelete === "function") {
      onDelete(movie.id);
    }
    setIsEditing(false);
    onClose();
  }}
/>
        )}
      </div>
    </>
  );
}

AdminMovieModal.propTypes = {
  movie: PropTypes.object,
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};

export default AdminMovieModal;